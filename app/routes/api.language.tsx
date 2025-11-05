import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async (_: LoaderFunctionArgs) => {
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const formData = await request.formData();
    const language = String(formData.get('language') || 'english');
    const allowed = ['english','vietnamese','french'];
    const lang = allowed.includes(language) ? language : 'english';

    const clientAny = prisma as unknown as any;
    const delegate = clientAny.storeSettings;
    if (!delegate) {
      const keys = Object.keys(clientAny || {});
      throw new Error(`Prisma delegate prisma.storeSettings not found. Available: ${keys.join(', ')}`);
    }

    const saved = await delegate.upsert({
      where: { shop: session.shop },
      update: { language: lang },
      create: { shop: session.shop, language: lang },
    });

    return new Response(JSON.stringify({ success: true, language: lang, store: saved }), { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    console.error('Save language failed', error);
    return new Response(JSON.stringify({ success: false, error: error?.message || String(error) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


