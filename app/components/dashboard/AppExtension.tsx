import React, { useEffect, useRef, useState } from "react"
import { t } from "../../locales"

export default function AppExtension() {
  const [visible, setVisible] = useState({ banner: false, loading: true });
  const STORAGE_KEY = 'preloaders.appExtensionBanner.dismissed';
  const bannerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    // If user dismissed the banner in this session, don't fetch; keep hidden
    try {
      const dismissed = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1';
      if (dismissed) {
        setVisible({ banner: false, loading: false });
        return () => { isMounted = false };
      }
    } catch {}

    (async () => {
      try {
        const resp = await fetch('/api/extension-status', { credentials: 'include' });
        const data = await resp.json();
        if (!isMounted) return;
        setVisible({ banner: !(data?.enabled === true), loading: false });
      } catch {
        if (!isMounted) return;
        setVisible({ banner: true, loading: false });
      }
    })();
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    if (!visible.banner) return;
    const el = bannerRef.current as HTMLElement | null;
    if (!el) return;

    const handler = () => {
      try {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, '1');
        }
      } catch {}
      setVisible(v => ({ ...v, banner: false }));
    };

    el.addEventListener('dismiss', handler);
    return () => {
      el.removeEventListener('dismiss', handler);
    };
  }, [visible.banner]);

  if (visible.loading || !visible.banner) return null;

  return (
    <s-banner
      ref={bannerRef as any}
      heading={t('dashboard.cards.appExtension.title')}
      tone="warning"
      dismissible={true}
      >
      {t('dashboard.cards.appExtension.content')}
      <s-button slot="secondary-actions" href="https://admin.shopify.com/themes/current/editor?context=apps">
        {t('dashboard.cards.appExtension.actions.enable')}
      </s-button>
      <s-button slot="secondary-actions" tone="neutral" variant="tertiary">
        {t('dashboard.cards.appExtension.actions.learnMore')}
      </s-button>
    </s-banner>
  )
}