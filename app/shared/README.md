# Shared Loader Definitions

This directory contains shared loader definitions that are used by both the admin app (for demos) and the theme extension (for frontend display).

## Files

- `loaderDefinitions.js` - Central source of truth for all preloader configurations

## How It Works

### Single Source of Truth
All preloader styles, animations, and configurations are defined in `loaderDefinitions.js`. This ensures consistency between:
- Admin app previews (in settings page)
- Theme extension (frontend display)

### Structure
Each loader definition contains:
- `name` - Display name
- `description` - Description text
- `category` - Category for filtering (classic/modern)
- `css` - CSS for admin app previews
- `html` - HTML for admin app previews

### Usage

#### In Admin App
```javascript
import { loaderDefinitions, getAllLoaderConfigs } from '../shared/loaderDefinitions';

// Get all loader configs for the settings page
const loaderConfigs = getAllLoaderConfigs();

// Get specific loader for preview
const loader = loaderDefinitions['spinner'];
```

#### In Theme Extension
The extension files are automatically generated from the shared definitions using:
```bash
npm run generate:extensions
```

This creates individual `.js` files in `extensions/preloader-extension/assets/` with the appropriate CSS and HTML for the theme extension.

## Adding New Loaders

1. Add the loader definition to `loaderDefinitions.js`
2. Run `npm run generate:extensions` to update extension files
3. The new loader will automatically appear in the admin app

## Benefits

- **Consistency**: Same animations in admin and frontend
- **Maintainability**: Edit in one place, updates everywhere
- **Type Safety**: Centralized configuration prevents mismatches
- **Automation**: Extension files are auto-generated
