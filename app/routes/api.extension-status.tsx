import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  let themeAppEnabled = false;
  try {
    const gql = `#graphql
      query CheckAppEmbed {
        themes(first: 1, roles: [MAIN]) {
          nodes {
            id
            files(filenames: ["config/settings_data.json"], first: 1) {
              nodes { filename body { __typename ... on OnlineStoreThemeFileBodyText { content } ... on OnlineStoreThemeFileBodyBase64 { contentBase64 } } }
            }
          }
        }
      }
    `;
    const resp = await admin.graphql(gql);
    const data = await resp.json();
    const fileNode = data?.data?.themes?.nodes?.[0]?.files?.nodes?.[0];

    let content = "";
    const bodyType = fileNode?.body?.__typename;
    if (bodyType === 'OnlineStoreThemeFileBodyText') {
      content = fileNode?.body?.content || "";
    } else if (bodyType === 'OnlineStoreThemeFileBodyBase64') {
      const base64 = fileNode?.body?.contentBase64 || "";
      if (base64) content = Buffer.from(base64, 'base64').toString('utf-8');
    } else if (bodyType === 'OnlineStoreThemeFileBodyUrl') {
      const url = fileNode?.body?.url;
      if (url) {
        const r = await fetch(url);
        content = await r.text();
      }
    }

    if (content) {
      const toJsonText = (text: string) => {
        let t = text.replace(/^\uFEFF/, "");
        t = t.replace(/\/\*[\s\S]*?\*\//g, "");
        t = t.replace(/^\s*\/\/.*$/gm, "");
        t = t.trim();
        if (!t.startsWith('{')) {
          const start = t.indexOf('{');
          const end = t.lastIndexOf('}');
          if (start !== -1 && end !== -1 && end > start) {
            t = t.slice(start, end + 1);
          }
        }
        return t;
      };

      let parsed: any | undefined;
      try {
        parsed = JSON.parse(toJsonText(content));
      } catch {}

      if (parsed) {
        const blocks = (parsed && parsed.current && (parsed.current as any).blocks) || {};
        themeAppEnabled = Object.values(blocks as Record<string, any>).some((block: any) => {
          const typeStr = typeof block?.type === 'string' ? block.type : '';
          const isOurBlock = typeStr.includes('/blocks/preloader/');
          const notDisabled = block?.disabled === false || block?.disabled === undefined;
          return isOurBlock && notDisabled;
        });
      }
    }
  } catch {}

  return new Response(JSON.stringify({ enabled: !!themeAppEnabled }), {
    headers: { 'Content-Type': 'application/json' }
  });
};


