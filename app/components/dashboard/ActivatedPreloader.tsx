import { useEffect, useState } from "react";
import LoaderPreview from "../LoaderPreview";
import { t } from "../../locales";

type PreloaderSettings = {
  cssLoader: string;
  background: string;
  primary: string;
  secondary: string;
  animationSpeed: string;
};

export default function ActivatedPreloader() {
  const [state, setState] = useState<{
    loading: boolean;
    configured: boolean;
    settings?: PreloaderSettings;
  }>({ loading: true, configured: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch('/api/activated-preloader', { credentials: 'include' });
        const data = await resp.json();
        if (!mounted) return;
        setState({ loading: false, configured: !!data?.configured, settings: data?.settings });
      } catch {
        if (!mounted) return;
        setState({ loading: false, configured: false });
      }
    })();
    return () => { mounted = false };
  }, []);

  if (state.loading) {
    return (
      <s-section heading={t('dashboard.cards.activatedPreloader.title')}>
        <s-grid gridTemplateColumns="1fr 1fr" gap="base" alignItems="start">
          <s-stack gap="base">
            <s-paragraph color="subdued">
              <s-text>{t('dashboard.cards.activatedPreloader.content')} {' '}</s-text>
              <s-text type="strong">{state.settings?.cssLoader}</s-text>.
            </s-paragraph>
            <s-button href="/app/preloaders" variant="secondary">{t('dashboard.cards.activatedPreloader.actions.change')}</s-button>
          </s-stack>
          <div style={{height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <s-spinner accessibilityLabel="Loading" />
          </div>
        </s-grid>
      </s-section>
    )
  }

  if (state.configured && state.settings) {
    const isValidSpeed = (v: any): v is "slow" | "medium" | "fast" => v === "slow" || v === "medium" || v === "fast";
    const safeSpeed = isValidSpeed(state.settings.animationSpeed) ? state.settings.animationSpeed : "medium";
    return (
      <s-section heading={t('dashboard.cards.activatedPreloader.title')}>
        <s-grid gridTemplateColumns="1fr 1fr" gap="base" alignItems="start">
          <s-stack gap="base">
            <s-paragraph color="subdued">
                <s-text>{t('dashboard.cards.activatedPreloader.content')} {' '}</s-text>
                <s-text type="strong">{state.settings.cssLoader}</s-text>.
            </s-paragraph>
            <s-button href="/app/preloaders" variant="secondary">{t('dashboard.cards.activatedPreloader.actions.change')}</s-button>
          </s-stack>
        <LoaderPreview
            type={state.settings.cssLoader}
            colorSettings={{
            background: state.settings.background,
            primary: state.settings.primary,
            secondary: state.settings.secondary,
            }}
            speed={safeSpeed}/>
        </s-grid>
      </s-section>
    );
  }

  return (
    <s-section>
      <s-grid
        gridTemplateColumns="1fr auto"
        gap="small-400"
        alignItems="start"
      >
        <s-grid
          gridTemplateColumns="@container (inline-size <= 480px) 1fr, auto auto"
          gap="base"
          alignItems="center"
        >
          <s-grid gap="small-200">
            <s-heading>{t('dashboard.cards.activatedPreloader.skeleton.title')}</s-heading>
            <s-paragraph>
              {t('dashboard.cards.activatedPreloader.skeleton.content')}
            </s-paragraph>
            <s-stack direction="inline" gap="small-200">
              <s-button href="/app/preloaders">{t('dashboard.cards.activatedPreloader.skeleton.actions.change')}</s-button>
            </s-stack>
          </s-grid>
          <s-stack alignItems="center">
            <s-box
              maxInlineSize="300px"
              borderRadius="base"
              overflow="hidden"
            >
              <s-image
                src="/placeholder.svg"
                alt="Preloadify preloader placeholder"
                aspectRatio="3/2"
              ></s-image>
            </s-box>
          </s-stack>
        </s-grid>
      </s-grid>
    </s-section>
  );
}
  