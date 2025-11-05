import React, { useEffect, useRef, useState } from "react"
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { authenticate } from "../shopify.server"
import prisma from "../db.server"
import { t } from "../locales"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request)
  const clientAny = prisma as unknown as any
  const prismaStoreSettings = clientAny?.storeSettings
  if (!prismaStoreSettings?.findUnique) {
    return { language: 'english' }
  }
  const store = await prismaStoreSettings.findUnique({ where: { shop: session.shop } })
  const language = store?.language || 'english'
  return { language }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request)
  const formData = await request.formData()
  const lang = String(formData.get("language") || 'english')
  const clientAny = prisma as unknown as any
  const prismaStoreSettings = clientAny?.storeSettings
  if (!prismaStoreSettings?.upsert) {
    return { success: true, language: lang }
  }
  const saved = await prismaStoreSettings.upsert({
    where: { shop: session.shop },
    update: { languages: [lang] },
    create: { shop: session.shop, languages: [lang] },
  })
  return new Response(JSON.stringify({ success: true, language: lang, store: saved }), { headers: { 'Content-Type': 'application/json' } })
}

export default function SettingsPage() {
  const data = useLoaderData() as { language: string }
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [lang, setLang] = useState<string>(data?.language || 'english')
  const selectRef = useRef<any>(null)
  
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/extension-status', { credentials: 'include' });
        const data = await resp.json();

        setVisible(data?.enabled === true ? true : false);
      } catch {
        setVisible(false);
      }
    })();
  }, []);

  const onLanguageChange = async (e: any) => {
    const el = e?.currentTarget as any
    const value = String(el?.value ?? e?.detail?.value ?? '')
    if (!value) return
    setSaved(false)
    setLang(value)
    try {
      const fd = new FormData()
      fd.set('language', value)
      const resp = await fetch('/api/language', { method: 'POST', body: fd, credentials: 'include' })
      if (resp.ok) {
        setSaved(true)
        try {
          sessionStorage.setItem('preloaders.ui.language', value)
          document.documentElement.setAttribute('data-lang', value)
        } catch {}
      }
    } catch {}
  }

  // Ensure events from custom element are captured reliably
  useEffect(() => {
    let el: any
    const attach = () => {
      el = selectRef.current as any
      if (!el) return
      el.addEventListener('change', onLanguageChange)
      el.addEventListener('input', onLanguageChange)
    }
    const detach = () => {
      try {
        if (el) {
          el.removeEventListener('change', onLanguageChange)
          el.removeEventListener('input', onLanguageChange)
        }
      } catch {}
    }
    const id = setTimeout(attach, 0)
    return () => { clearTimeout(id); detach() }
  }, [])

  const onSubmit = async (e: any) => { e.preventDefault() }

  return (
    <form 
      method="post"
      data-save-bar
      onSubmit={onSubmit}
    >
      <s-page heading={t('storeSettings.title')} inlineSize="small">
        <s-section heading={t('storeSettings.extension.title')}>
          <s-grid
            gridTemplateColumns="1fr auto"
            alignItems="center"
            gap="large-300"
          >
            <s-text color="subdued">
              {t('storeSettings.language.help')}
            </s-text>
            <s-button
              tone="critical"
              disabled={visible}
              href="https://admin.shopify.com/themes/current/editor?context=apps"
            >
              {visible ? t('storeSettings.extension.enabled') : t('storeSettings.extension.enable')}
            </s-button>
          </s-grid>
        </s-section>
        <s-section heading={t('storeSettings.language.title')}>
          <s-stack gap="small-200">
            <s-text color="subdued">{t('storeSettings.language.help')}</s-text>
            <s-select
              ref={selectRef as any}
              name="language"
              value={lang}
              onChange={onLanguageChange}
              label={t('storeSettings.language.label')}
            >
              <s-option value="english">{t('storeSettings.language.english')}</s-option>
              <s-option value="french">{t('storeSettings.language.french')}</s-option>
            </s-select>
          </s-stack>
        </s-section>
        <s-stack direction="inline" gap="small-200"></s-stack>
      </s-page>
    </form>
  );
}
