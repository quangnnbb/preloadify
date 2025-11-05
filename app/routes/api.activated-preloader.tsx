import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.admin(request);
    const prismaSettings = (prisma as unknown as { settings: { findUnique: Function } }).settings;
    const settings = await prismaSettings.findUnique({ where: { shop: session.shop } });

    if (!settings) {
      return new Response(JSON.stringify({ configured: false }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      configured: true,
      settings: {
        cssLoader: settings.cssLoader,
        background: settings.background,
        primary: settings.primary,
        secondary: settings.secondary,
        animationSpeed: settings.animationSpeed ?? 'medium',
      }
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    // If unauthenticated, surface 401 so client can avoid infinite redirects
    const status = (e as any)?.status || (e instanceof Response ? e.status : 401);
    return new Response(JSON.stringify({ configured: false, error: 'unauthorized' }), {
      headers: { 'Content-Type': 'application/json' },
      status,
    });
  }
};


