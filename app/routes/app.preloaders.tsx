import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router"
import { useLoaderData } from "react-router"
import { useState, useEffect, useRef, type RefObject } from "react"
import { authenticate } from "../shopify.server"
import prisma from "../db.server"
import { createOrUpdateAppMetafield } from "../metafields/create"
import { 
  getAllLoaderConfigs, 
  getCategories 
} from "../shared/loaderDefinitions"
import ColorPickerButton from "../components/ColorPickerButton"
import LoaderPreview from "../components/LoaderPreview"
import { hexToHslInit as hexToHslInitUtil, extractColorValue as extractColorValueUtil } from "../utils/color"
import Footer from "../components/dashboard/Footer"
import { t } from "../locales"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);
    
    const prismaSettings = (prisma as unknown as { settings: { findUnique: Function; upsert: Function } }).settings;
    const settings = await prismaSettings.findUnique({
      where: { shop: session.shop },
    });

    // Read animationSpeed from metafield so it persists even if DB lacks the column
    let animationSpeed = "medium";
    try {
      const query = `#graphql
        query AppAnimationSpeed {
          currentAppInstallation {
            metafield(namespace: "preloader", key: "animationSpeed") { value }
          }
        }
      `;
      const resp = await admin.graphql(query);
      const data = await resp.json();
      animationSpeed = data?.data?.currentAppInstallation?.metafield?.value || "medium";
    } catch (e) {
      // Ignore metafield read errors; fall back to default
    }
    
    return {
      shop: session.shop,
      settings: (settings
        ? { ...settings, animationSpeed }
        : { cssLoader: "pulseOrbit", background: "#efefef", primary: "#e03e3e", secondary: "#f3d3d3", animationSpeed }
      )
    };
  } catch (error) {
    console.error("Loader error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return {
      shop: "unknown",
      settings: { cssLoader: "pulseOrbit", background: "#efefef", primary: "#e03e3e", secondary: "#f3d3d3", animationSpeed: "medium" },
      error: message
    };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);
    const graphql = admin.graphql;
    
    const formData = await request.formData();
    const cssLoader = formData.get("cssLoader");
    const background = formData.get("background");
    const primary = formData.get("primary");
    const secondary = formData.get("secondary");
    const animationSpeed = formData.get("animationSpeed") || "medium";
    const extractColorValue = extractColorValueUtil

    // Ensure we have string values - handle Polaris ColorPicker objects
    const backgroundValue = extractColorValue(background, "#efefef");
    const primaryValue = extractColorValue(primary, "#e03e3e");
    const secondaryValue = extractColorValue(secondary, "#f3d3d3");
    
    try {
      await createOrUpdateAppMetafield("cssLoader", cssLoader, graphql, "preloader", "single_line_text_field");
      
      await createOrUpdateAppMetafield("background", backgroundValue, graphql, "preloader", "single_line_text_field");
      
      await createOrUpdateAppMetafield("primary", primaryValue, graphql, "preloader", "single_line_text_field");
      
      await createOrUpdateAppMetafield("secondary", secondaryValue, graphql, "preloader", "single_line_text_field");

      await createOrUpdateAppMetafield("animationSpeed", animationSpeed, graphql, "preloader", "single_line_text_field");
    } catch (metafieldError) {
      console.error("❌ Metafield creation error:", metafieldError);
    }
    
    // Persist core settings in DB (exclude animationSpeed to avoid schema drift)
    const prismaSettings = (prisma as unknown as { settings: { upsert: Function } }).settings;
    await prismaSettings.upsert({
      where: { shop: session.shop },
      update: {
        cssLoader: cssLoader || "pulseOrbit",
        background: backgroundValue,
        primary: primaryValue,
        secondary: secondaryValue,
        updatedAt: new Date(),
      },
      create: {
        shop: session.shop,
        cssLoader: cssLoader || "pulseOrbit",
        background: backgroundValue,
        primary: primaryValue,
        secondary: secondaryValue,
      },
    });
    
    return {
      success: true,
      message: "Settings saved successfully!",
      settings: {
        cssLoader,
        background: backgroundValue,
        primary: primaryValue,
        secondary: secondaryValue,
        animationSpeed,
      },
    };
  } catch (error) {
    console.error("Action error:", error);
    const details = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : { message: String(error) };
    console.error("Error details:", details);
    
    return {
      success: false,
      error: `Failed to save settings: ${details.message}`,
    };
  }
};

export default function Preloaders() {
  const data = useLoaderData<typeof loader>() as any;
  const settings = data?.settings ?? {
    cssLoader: "pulseOrbit",
    background: "#efefef",
    primary: "#e03e3e",
    secondary: "#f3d3d3",
    animationSpeed: "medium",
  };
  
  const [selectedLoader, setSelectedLoader] = useState(settings.cssLoader || "pulseOrbit");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [animationSpeed, setAnimationSpeed] = useState(settings.animationSpeed || "medium");
  
  const hexToHslInit = hexToHslInitUtil
  
  const [colorSettings, setColorSettings] = useState(() => ({
    background: settings.background ? hexToHslInit(settings.background) : hexToHslInit("#efefef"),
    primary: settings.primary ? hexToHslInit(settings.primary) : hexToHslInit("#e03e3e"),
    secondary: settings.secondary ? hexToHslInit(settings.secondary) : hexToHslInit("#f3d3d3")
  }));
  const cssLoaderInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);
  const animationSpeedInputRef = useRef<HTMLInputElement>(null);
  const initialSnapshotRef = useRef<string | null>(null);
  const mountedRef = useRef(false);

  const extractColorValue = extractColorValueUtil

  // Ensure all same-origin fetch requests include cookies to prevent session loss
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;
    const originalFetch = window.fetch;
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const url = typeof input === 'string' ? input : (input as Request).url ?? '';
        const isAbsolute = /^https?:\/\//i.test(url);
        const sameOrigin = !isAbsolute || url.startsWith(window.location.origin);
        const currentCreds = (init && init.credentials) || (input instanceof Request ? input.credentials : undefined);
        if (sameOrigin && currentCreds == null) {
          init = { ...(init || {}), credentials: 'include' };
        }
      } catch {}
      return originalFetch(input as any, init as any);
    }) as typeof window.fetch;
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const form: HTMLFormElement = e.currentTarget;
      const formData = new FormData(form);
      const actionUrl = form.getAttribute('action') || '/app/preloaders';
      const resp = await fetch(actionUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (resp.ok) {
        const result = await resp.json();
        if (result?.success) {
          // Mark current state as saved so Save Bar hides without reload
          const backgroundHex = extractColorValue(colorSettings.background, "#efefef");
          const primaryHex = extractColorValue(colorSettings.primary, "#e03e3e");
          const secondaryHex = extractColorValue(colorSettings.secondary, "#efefef");
          const snapshot = JSON.stringify({
            cssLoader: selectedLoader,
            background: backgroundHex,
            primary: primaryHex,
            secondary: secondaryHex,
            animationSpeed,
          });
          initialSnapshotRef.current = snapshot;
          // Nudge data-save-bar by dispatching input events with same values
          try {
            if (cssLoaderInputRef?.current) cssLoaderInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            if (backgroundInputRef?.current) backgroundInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            if (primaryInputRef?.current) primaryInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            if (secondaryInputRef?.current) secondaryInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
            if (animationSpeedInputRef?.current) animationSpeedInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
          } catch {}
        }
      } else if (resp.status === 401) {
        window.location.href = '/auth/login';
      }
    } catch {}
  };

  const handleDiscard = () => {
    setSelectedLoader(settings.cssLoader || "pulseOrbit");
    setColorSettings({
      background: settings.background ? hexToHslInit(settings.background) : hexToHslInit("#efefef"),
      primary: settings.primary ? hexToHslInit(settings.primary) : hexToHslInit("#e03e3e"),
      secondary: settings.secondary ? hexToHslInit(settings.secondary) : hexToHslInit("#f3d3d3")
    });
    setAnimationSpeed(settings.animationSpeed || "medium");
  };

  // Notify native Save Bar about unsaved changes by dispatching input events on hidden inputs
  useEffect(() => {
    // On first mount, capture initial snapshot and skip dispatching to prevent Save Bar flashing
    if (!mountedRef.current) {
      initialSnapshotRef.current = JSON.stringify({
        cssLoader: settings.cssLoader || "pulseOrbit",
        background: settings.background || "#efefef",
        primary: settings.primary || "#e03e3e",
        secondary: settings.secondary || "#f3d3d3",
        animationSpeed: settings.animationSpeed || "medium",
      });
      mountedRef.current = true;
      return;
    }

    const backgroundHex = extractColorValue(colorSettings.background, "#efefef");
    const primaryHex = extractColorValue(colorSettings.primary, "#e03e3e");
    const secondaryHex = extractColorValue(colorSettings.secondary, "#efefef");

    const currentSnapshot = JSON.stringify({
      cssLoader: selectedLoader,
      background: backgroundHex,
      primary: primaryHex,
      secondary: secondaryHex,
      animationSpeed,
    });

    // If nothing changed compared to initial saved state, don't signal Save Bar
    if (currentSnapshot === initialSnapshotRef.current) {
      return;
    }

    const updateInput = (ref: RefObject<HTMLInputElement>, value: string) => {
      if (!ref?.current) return;
      try {
        // Update value property and dispatch an input event so data-save-bar detects dirtiness
        if (ref.current.value !== value) {
          ref.current.value = value;
        }
        ref.current.dispatchEvent(new Event('input', { bubbles: true }));
      } catch {}
    };

    updateInput(cssLoaderInputRef, selectedLoader);
    updateInput(backgroundInputRef, backgroundHex);
    updateInput(primaryInputRef, primaryHex);
    updateInput(secondaryInputRef, secondaryHex);
    updateInput(animationSpeedInputRef, animationSpeed);
  }, [selectedLoader, colorSettings, animationSpeed, settings]);

  // Wire discard to native Save Bar reset button
  useEffect(() => {
    const form = document.querySelector('#settings-form');
    if (!form) return;
    const onReset = () => handleDiscard();
    form.addEventListener('reset', onReset);
    return () => form.removeEventListener('reset', onReset);
  }, [settings]);

  // Get configurations from shared definitions
  const loaderConfig = Object.fromEntries(getAllLoaderConfigs()) as Record<string, { name: string; description: string; category: string; preview: string }>;
  const categories = getCategories();

  // Filter loaders based on selected category
  const filteredLoaders: Array<[string, { name: string; description: string; category: string; preview: string }]> = selectedCategory === "all"
    ? Object.entries(loaderConfig)
    : Object.entries(loaderConfig).filter(([_, config]) => config.category === selectedCategory);

  return (
    <form 
      method="post"
      id="settings-form"
      data-save-bar
      onSubmit={handleSubmit}
    >
      <s-page heading={t('preloaderSettings.title')}>
        <s-section>
          <s-stack gap="large">
            <s-stack gap="large-300">
              <s-stack>
                <s-stack>
                  <s-heading>{t('preloaderSettings.title')}</s-heading>
                  <s-text color="subdued">{t('preloaderSettings.description')}</s-text>
                </s-stack>
              </s-stack>
              <s-stack direction="inline" gap="small-300">
                {Object.entries(categories).map(([key, category]) => (
                  <s-button
                    key={`${key}-${selectedCategory === key}`}
                    variant={selectedCategory === key ? "primary" : "secondary"}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {t(`preloaderSettings.filter.${key}`)}
                  </s-button>
                ))}
              </s-stack>
            </s-stack>

            <s-grid
              gridTemplateColumns="repeat(auto-fit, minmax(220px, 1fr))"
              gap="base"
            >
              {filteredLoaders.map(([key, config]) => (
                <div
                  onClick={() => {
                    // Immediately sync hidden input so native Save Bar submits the latest value
                    try {
                      if (cssLoaderInputRef?.current) {
                        if (cssLoaderInputRef.current.value !== key) {
                          cssLoaderInputRef.current.value = key;
                        }
                        cssLoaderInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
                      }
                    } catch {}
                    setSelectedLoader(key);
                  }}
                  style={{height: '100%', cursor: 'pointer'}}
                  key={key}
                >
                  <s-box
                    borderColor={selectedLoader === key ? "strong" : "subdued"}
                    borderWidth="base"
                    borderStyle="solid"
                    borderRadius="base"
                  >
                    <LoaderPreview type={key} colorSettings={colorSettings} speed={animationSpeed} />
                    <s-box padding="base">
                      <s-stack gap="small-100">
                        <s-stack direction="inline" gap="small-100">
                          <s-text type="strong">
                            {config.name}
                          </s-text>
                          {selectedLoader === key && <s-badge tone="success">{t('general.activated')}</s-badge>}
                        </s-stack>
                        <s-text color="subdued">
                          {config.description}
                        </s-text>
                      </s-stack>
                    </s-box>
                  </s-box>
                </div>
              ))}
            </s-grid>
          </s-stack>
        </s-section>
          
        <s-box slot="aside">
          <s-section heading={t('preloaderSettings.colors.title')}>
            <s-stack gap="base">
              <s-text color="subdued">{t('preloaderSettings.colors.description')}</s-text>
              <s-grid
                gridTemplateColumns="repeat(3, 1fr)"
                gap="small"
                justifyContent="center"
              >
                <ColorPickerButton
                  title={t('preloaderSettings.colors.background')}
                  color={colorSettings.background}
                  onChange={(color: any) => setColorSettings(prev => ({ ...prev, background: color }))}
                />

                <ColorPickerButton
                  title={t('preloaderSettings.colors.primary')}
                  color={colorSettings.primary}
                  onChange={(color: any) => setColorSettings(prev => ({ ...prev, primary: color }))}
                />

                <ColorPickerButton
                  title={t('preloaderSettings.colors.secondary')}
                  color={colorSettings.secondary}
                  onChange={(color: any) => setColorSettings(prev => ({ ...prev, secondary: color }))}
                />
              </s-grid>
            </s-stack>
          </s-section>
            <s-section heading={t('preloaderSettings.speed.title')}>
            <s-stack gap="base">
              <s-text color="subdued">{t('preloaderSettings.speed.description')}</s-text>
              <s-select
                label={t('preloaderSettings.speed.speed')}
                name="animation-speed"
                value={animationSpeed}
                onChange={(e: any) => setAnimationSpeed(e?.target?.value ?? "medium")}
              >
                <s-option value="slow">{t('preloaderSettings.speed.slow')}</s-option>
                <s-option value="medium">{t('preloaderSettings.speed.medium')}</s-option>
                <s-option value="fast">{t('preloaderSettings.speed.fast')}</s-option>
              </s-select>
            </s-stack>
          </s-section>
        </s-box>
        <Footer/>
      </s-page>
      <input ref={cssLoaderInputRef} type="hidden" name="cssLoader" value={selectedLoader} />
      <input ref={backgroundInputRef} type="hidden" name="background" value={extractColorValue(colorSettings.background, '#efefef')} />
      <input ref={primaryInputRef} type="hidden" name="primary" value={extractColorValue(colorSettings.primary, '#e03e3e')} />
      <input ref={secondaryInputRef} type="hidden" name="secondary" value={extractColorValue(colorSettings.secondary, '#efefef')} />
      <input ref={animationSpeedInputRef} type="hidden" name="animationSpeed" value={animationSpeed} />
    </form>
  );
}
