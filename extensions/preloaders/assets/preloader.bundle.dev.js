// Readable development bundle for the Preloader web component
// Mirrors the behavior of preloader.bundle.js but with unminified, annotated code

class ShopifyPreloader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // Render then wire events
    this.render().then(() => this.setupEventListeners());
  }

  getAttr(name, fallback) {
    const value = this.getAttribute(name);
    return value == null || value === '' ? fallback : value;
  }

  hexToRgb(hex) {
    hex = (hex || '#000000').replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) || 0;
    const g = parseInt(hex.substr(2, 2), 16) || 0;
    const b = parseInt(hex.substr(4, 2), 16) || 0;
    return { r, g, b };
  }

  async render() {
    const loaderType = this.getAttr('data-css-loader', 'pulseOrbit');
    const backgroundHex = this.getAttr('data-background', '#ffffff');
    const primaryHex = this.getAttr('data-primary', '#000000');
    const secondaryHex = this.getAttr('data-secondary', '#ffffff');
    const assetBase = this.getAttr('data-asset-base', '');

    const backgroundRgb = this.hexToRgb(backgroundHex);
    const primaryRgb = this.hexToRgb(primaryHex);
    const secondaryRgb = this.hexToRgb(secondaryHex);

    try {
      const allowed = [
        'pulseOrbit', 'thinLionfish', 'jollyKangaroo', 'emberLoop', 'orbitDot', 'hypnoticLoop',
        'dualOrbit', 'arcMotion', 'jumpingSquare', 'dualFrame', 'riseBlock', 'urbanDrive',
        'tameFly', 'loadingBar'
      ];
      const safeType = allowed.includes(loaderType) ? loaderType : 'pulseOrbit';

      // Build URL for the chosen loader asset by swapping the filename in the base
      const baseUrl = assetBase.replace('pulseOrbit.js', `${safeType}.js`);
      const module = await import(baseUrl);
      const config = module?.[`${safeType}Config`] || module?.default;

      if (!config || !config.css || !config.html) {
        throw new Error(`Invalid loader config for ${safeType}`);
      }

      // Apply color overrides to the CSS template
      let customizedCSS = config.css;
      const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
      const secondaryColor = `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`;
      customizedCSS = customizedCSS.replace(/#000/g, primaryColor);
      customizedCSS = customizedCSS.replace(/#0070f3/g, primaryColor);
      customizedCSS = customizedCSS.replace(/#f3f3f3/g, secondaryColor);

      const speed = this.getAttr('data-animation-speed', 'medium');
      const speedValue = speed === 'slow' ? '1.5s' : speed === 'fast' ? '.5s' : '1s';

      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --r: ${backgroundRgb.r};
            --g: ${backgroundRgb.g};
            --b: ${backgroundRgb.b};
            --p-r: ${primaryRgb.r};
            --p-g: ${primaryRgb.g};
            --p-b: ${primaryRgb.b};
            --s-r: ${secondaryRgb.r};
            --s-g: ${secondaryRgb.g};
            --s-b: ${secondaryRgb.b};
            --background: rgb(var(--r), var(--g), var(--b));
            --primary: rgb(var(--p-r), var(--p-g), var(--p-b));
            --secondary: rgb(var(--s-r), var(--s-g), var(--s-b));
            --speed: ${speedValue};
          }
          ${customizedCSS}
        </style>
        ${config.html}
      `;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to load loader:', loaderType, error);
    }
  }

  setupEventListeners() {
    // Preloader is already visible from CSS on page load
    // Just set up hide events
    
    // Hide preloader when page finishes loading
    window.addEventListener('load', () => {
      this.hide();
    });

    // Fallback: hide after 3 seconds if load event doesn't fire
    setTimeout(() => {
      this.hide();
    }, 3000);

    // Show preloader when clicking on navigation links
    this.setupLinkListeners();
  }

  setupLinkListeners() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attachLinkListeners());
    } else {
      this.attachLinkListeners();
    }

    // Re-attach listeners when new content is added (for dynamic content)
    const observer = new MutationObserver(() => {
      this.attachLinkListeners();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  attachLinkListeners() {
    // Get all links on the page
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
      // Skip if already has listener
      if (link.hasAttribute('data-preloader-attached')) {
        return;
      }

      // Mark as processed
      link.setAttribute('data-preloader-attached', 'true');

      // Add click listener
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip if:
        // - href is empty or just "#"
        // - href is an anchor link (starts with #)
        // - link has target="_blank" (opens in new tab)
        // - link has download attribute
        // - href is mailto: or tel:
        // - link is in the cart drawer or modal
        // - Cmd/Ctrl click (open in new tab)
        // - Right click
        if (
          !href ||
          href === '#' ||
          href.startsWith('#') ||
          link.getAttribute('target') === '_blank' ||
          link.hasAttribute('download') ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('javascript:') ||
          link.closest('[data-no-preloader]') ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.button !== 0
        ) {
          return;
        }

        // Check if it's an external link
        try {
          const linkUrl = new URL(href, window.location.origin);
          const currentUrl = new URL(window.location.href);

          // Skip external links
          if (linkUrl.origin !== currentUrl.origin) {
            return;
          }

          // Keep preloader visible for internal navigation
          // Cancel any pending hide animations
          if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
          }
          
          // Check computed style, not just inline style
          const computedStyle = window.getComputedStyle(this);
          const isHidden = computedStyle.opacity === '0' || 
                          computedStyle.visibility === 'hidden' ||
                          this.style.opacity === '0' ||
                          this.style.visibility === 'hidden';
          
          // Only show if actually hidden
          if (isHidden) {
            this.show();
          }
        } catch (error) {
          // If URL parsing fails, it's likely a relative URL - keep preloader visible
          if (this._hideTimeout) {
            clearTimeout(this._hideTimeout);
            this._hideTimeout = null;
          }
          
          // Check computed style, not just inline style
          const computedStyle = window.getComputedStyle(this);
          const isHidden = computedStyle.opacity === '0' || 
                          computedStyle.visibility === 'hidden' ||
                          this.style.opacity === '0' ||
                          this.style.visibility === 'hidden';
          
          // Only show if actually hidden
          if (isHidden) {
            this.show();
          }
        }
      });
    });
  }

  show() {
    // Remove any hide transition classes and make visible immediately
    this.style.transition = 'none';
    this.style.opacity = '1';
    this.style.pointerEvents = 'auto';
    this.style.visibility = 'visible';
    
    // Re-enable transitions after a brief moment
    setTimeout(() => {
      this.style.transition = '';
    }, 10);
  }

  hide() {
    // Store timeout reference so we can cancel it if needed
    this._hideTimeout = setTimeout(() => {
      this.style.opacity = '0';
      this.style.pointerEvents = 'none';
      setTimeout(() => {
        this.style.visibility = 'hidden';
      }, 500);
    }, 500);
  }
}

// Register the Web Component once
if (!customElements.get('sht-preloader')) {
  customElements.define('sht-preloader', ShopifyPreloader);
}


