# Preloadify

A Shopify app that adds beautiful, customizable preloader animations to your store. Choose from 15+ professional loading animations, customize colors and speeds, and seamlessly integrate with any Shopify theme.

## Features

- **15+ Professional Animations**: Choose from dots, spinners, squares, graphic elements, and bars
- **Full Customization**: 
  - Customizable primary and secondary colors
  - Adjustable animation speeds
  - Custom background colors
- **Multi-language Support**: English, French, and Vietnamese
- **Theme Extension**: Seamless integration with any Shopify theme
- **Single Source of Truth**: Shared loader definitions ensure consistency between admin previews and frontend display
- **Auto-Generation**: Extension files are automatically generated and minified for optimal performance

## Preloader Categories

- **Dots**: Pulse Orbit, Thin Lionfish, Jolly Kangaroo, Tame Fly
- **Spinner**: Ember Loop, Orbit Dot, Hypnotic Loop, Dual Orbit, Arc Motion
- **Square**: Jumping Square, Dual Frame, Rise Block
- **Graphic**: Urban Drive
- **Bars**: Loading Bar, Spectrum Pulse

## Tech Stack

- **Framework**: React Router v7
- **Platform**: Shopify App Platform
- **Auth & API**: [@shopify/shopify-app-react-router](https://shopify.dev/docs/api/shopify-app-react-router)
- **Database**: Prisma ORM with SQLite (production-ready for single-instance deployments)
- **UI**: Shopify Polaris components via App Bridge
- **Extension**: Shopify Theme App Extension
- **Languages**: TypeScript, JavaScript

## Prerequisites

Before you begin, ensure you have:

1. **Node.js**: Version 20.10 or higher ([Download](https://nodejs.org/en/download/))
2. **Shopify Partner Account**: [Create an account](https://partners.shopify.com/signup)
3. **Test Store**: Set up a [development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) or [Shopify Plus sandbox](https://help.shopify.com/en/partners/dashboard/managing-stores/plus-sandbox-store)
4. **Shopify CLI**: Install globally
   ```bash
   npm install -g @shopify/cli@latest
   ```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sht-preloaders
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

```bash
npm run setup
```

This command will:
- Generate Prisma client
- Run database migrations

### 4. Generate Extension Files

```bash
npm run generate:extensions
```

This generates optimized loader files for the theme extension from the shared loader definitions.

## Development

### Start Development Server

```bash
npm run dev
```

or

```bash
shopify app dev
```

Press **P** to open the app URL in your browser. The Shopify CLI will:
- Connect to your Partner account
- Provide a tunnel to your local server
- Auto-update environment variables
- Hot-reload on code changes

### Development Workflow

1. Make changes to loader definitions in `app/shared/loaderDefinitions.js`
2. Run `npm run generate:extensions` to update extension files
3. Changes will be reflected in both admin previews and theme extension

## Project Structure

```
sht-preloaders/
├── app/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── ColorPickerButton.tsx
│   │   ├── ColorPickerModal.tsx
│   │   └── LoaderPreview.tsx
│   ├── locales/            # i18n translation files (en, fr, vi)
│   ├── routes/             # React Router route definitions
│   ├── shared/             # Shared code between admin and extension
│   │   └── loaderDefinitions.js  # Single source of truth for all preloaders
│   ├── utils/              # Utility functions
│   ├── db.server.ts        # Database client
│   └── shopify.server.ts   # Shopify API configuration
├── extensions/
│   └── preloaders/         # Theme app extension
│       ├── assets/         # Auto-generated loader files
│       ├── blocks/         # Liquid template blocks
│       └── locales/        # Extension translations
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── scripts/
│   ├── generateExtensionFiles.js  # Generate extension assets
│   └── minifyPreloaderBundle.js   # Minify production bundles
└── public/                 # Static assets
```

## Database Schema

### Session
Stores Shopify authentication sessions.

### Settings
Stores preloader configuration per shop:
- `cssLoader`: Selected preloader type
- `background`: Background color
- `primary`: Primary animation color
- `secondary`: Secondary animation color
- `animationSpeed`: Animation speed (slow/medium/fast)

### StoreSettings
Stores app preferences per shop:
- `language`: Selected language (english/french/vietnamese)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Shopify CLI |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run setup` | Set up database (generate Prisma client + run migrations) |
| `npm run deploy` | Deploy app to Shopify |
| `npm run generate:extensions` | Generate extension files from shared definitions |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Adding New Preloaders

1. **Add loader definition** to `app/shared/loaderDefinitions.js`:
   ```javascript
   export const loaderDefinitions = {
     myNewLoader: {
       name: "My New Loader",
       description: "Perfect for modern websites",
       category: "spinner",
       css: `/* Your CSS here */`,
       html: `<!-- Your HTML here -->`
     }
   };
   ```

2. **Generate extension files**:
   ```bash
   npm run generate:extensions
   ```

3. **Test in admin**: The new loader will automatically appear in the settings page

4. **Deploy**: The extension will be updated on next deployment

## Architecture Highlights

### Shared Loader Definitions

All preloader configurations live in `app/shared/loaderDefinitions.js`. This ensures:
- **Consistency**: Same animations in admin previews and live store
- **Maintainability**: Edit in one place, updates everywhere
- **Automation**: Extension files auto-generated from source
- **Type Safety**: Centralized configuration prevents mismatches

### Auto-Generated Extensions

The `generateExtensionFiles.js` script:
1. Reads shared loader definitions
2. Minifies CSS and HTML
3. Generates individual `.js` files for each loader
4. Creates a `config.json` manifest
5. Outputs to `extensions/preloaders/assets/`

This workflow eliminates manual synchronization and reduces bundle sizes.

## API Scopes

The app requires the following Shopify API scopes:
- `read_metaobject_definitions`
- `write_metaobject_definitions`
- `read_metaobjects`
- `write_metaobjects`
- `read_themes`

## Webhooks

The app listens to:
- `app/uninstalled` - Clean up on app uninstallation
- `app/scopes_update` - Handle scope changes

## Feature Request Integration (Google Sheets)

The app includes a feature request system that automatically saves customer feedback to Google Sheets using Google Apps Script.

### Setup Google Sheets Integration

#### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Preloadify Feature Requests" (or any name you prefer)
4. Keep this sheet open

#### 2. Deploy Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `google-apps-script/Code.gs` from this repository
4. Paste it into the Apps Script editor
5. Click **Save** (or press Ctrl+S / Cmd+S)
6. Name your project "Preloadify Feature Requests Handler"

#### 3. Deploy as Web App

1. Click **Deploy** > **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Feature Request Handler v1"
   - **Execute as**: "Me" (your account)
   - **Who has access**: "Anyone"
4. Click **Deploy**
5. You may need to authorize the script:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** > **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. **Copy the Web app URL** (it looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

#### 4. Configure Environment Variables

Add the Web app URL to your environment variables:

**For Local Development** (`.env` file):
```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**For Production** (set in your hosting platform):
- Variable name: `GOOGLE_SHEETS_WEBHOOK_URL`
- Value: Your Web app URL from step 3

#### 5. Test the Integration

**Test from Apps Script Editor:**
1. In the Apps Script editor, select `testFeatureRequest` from the function dropdown
2. Click the **Run** button
3. Check your Google Sheet - you should see a test row

**Test from Your App:**
1. Start your development server: `npm run dev`
2. Open the app and navigate to Dashboard
3. Click **Feature Request** in the Support Channels section
4. Fill out the form and click "Send request"
5. Check your Google Sheet - a new row should appear

### Spreadsheet Structure

The script automatically creates these columns on the first request:

| Timestamp | Shop | Details | References |
|-----------|------|---------|------------|
| 2025-10-17 10:30:00 | shop1.myshopify.com | Feature description... | Links or N/A |

### Troubleshooting Google Sheets

**"Google Sheets integration is not configured" error:**
- Verify `GOOGLE_SHEETS_WEBHOOK_URL` is set in your environment variables
- Restart your development server after adding the variable

**"Failed to save feature request" error:**
- Check the Web app URL is correct and complete
- Verify "Who has access" is set to "Anyone" in deployment settings
- Check the Apps Script logs: Click **Executions** in the left sidebar

**"Script not authorized" error:**
- Make sure you clicked "Allow" when authorizing the script
- Redeploy the script and authorize again

**No data appearing in sheet:**
- Verify you're using the correct Google Sheet where you deployed the script
- Check the network tab in browser dev tools to see if the request is being sent
- Review the Apps Script execution logs for errors

### Updating the Script

If you need to modify the Google Apps Script:

1. Make changes in the Apps Script editor
2. Save the changes
3. Click **Deploy** > **Manage deployments**
4. Click the edit icon (pencil) next to your deployment
5. Change the version to "New version"
6. Click **Deploy**

**Note:** The Web app URL stays the same, so you don't need to update your environment variables.

### Security Notes

- The Web app URL is public but only accepts POST requests with specific data
- Anyone with the URL can submit feature requests (this is intentional for customer feedback)
- The Google Sheet is private to your Google account unless you explicitly share it
- If you need additional security, you can modify the script to validate an API key

### Features

- ✅ Automatic header creation with formatting on first request
- ✅ Timestamp for each submission
- ✅ Auto-resize columns for readability
- ✅ Error handling and logging
- ✅ Test function for verification
- ✅ Health check endpoint (GET request)

## Deployment

### Build the App

```bash
npm run build
```

### Deploy to Shopify

```bash
npm run deploy
```

### Environment Variables

For production deployment, ensure these environment variables are set:
- `NODE_ENV=production`
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SCOPES`
- `HOST`
- `GOOGLE_SHEETS_WEBHOOK_URL` (optional, for feature request integration)
- Database connection string (if not using SQLite)

### Hosting Options

Follow [Shopify's deployment documentation](https://shopify.dev/docs/apps/deployment/web) for hosting on:
- [Fly.io](https://fly.io/)
- [Heroku](https://www.heroku.com/)
- [Railway](https://railway.app/)
- Any Node.js-compatible hosting platform

### Database in Production

This app uses SQLite by default, which works for single-instance deployments. For multi-instance or high-scale deployments, consider:

| Database   | Type             | Providers |
|------------|------------------|-----------|
| PostgreSQL | SQL              | [Digital Ocean](https://www.digitalocean.com/products/managed-databases-postgresql), [Supabase](https://supabase.com/), [Neon](https://neon.tech/) |
| MySQL      | SQL              | [PlanetScale](https://planetscale.com/), [Digital Ocean](https://www.digitalocean.com/products/managed-databases-mysql) |
| MongoDB    | NoSQL / Document | [MongoDB Atlas](https://www.mongodb.com/atlas/database) |

Update `prisma/schema.prisma` datasource to match your chosen database.

## Internationalization

The app supports multiple languages:
- English (`en`)
- French (`fr`)
- Vietnamese (`vi`)

Translation files are located in:
- Admin app: `app/locales/`
- Extension: `extensions/preloaders/locales/`

To add a new language:
1. Create `app/locales/{lang}.json`
2. Create `extensions/preloaders/locales/{lang}.default.json`
3. Add language option to the settings UI

## Troubleshooting

### Database Tables Don't Exist

If you see:
```
The table `main.Session` does not exist in the current database.
```

Run the setup script:
```bash
npm run setup
```

### Extension Not Showing in Theme Editor

1. Ensure the extension is deployed: `npm run deploy`
2. In Shopify admin, go to **Online Store > Themes > Customize**
3. Add an app block from the Theme Editor
4. Look for "Preloadify" in the app blocks section

### Webhooks Not Processing

- Ensure webhooks are defined in `shopify.app.toml`
- Use app-specific webhooks (not admin-created ones)
- Test webhooks using `shopify webhook trigger`

## Resources

### Shopify Documentation
- [Shopify App Development](https://shopify.dev/docs/apps/getting-started)
- [Shopify App React Router](https://shopify.dev/docs/api/shopify-app-react-router)
- [Theme App Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
- [App Bridge](https://shopify.dev/docs/api/app-bridge-library)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)

### Framework Documentation
- [React Router v7](https://reactrouter.com/home)
- [Prisma ORM](https://www.prisma.io/docs)
- [Vite](https://vitejs.dev/)

### Design Resources
- [Shopify Polaris](https://polaris.shopify.com/)
- [Polaris Web Components](https://shopify.dev/docs/api/app-home/polaris-web-components)

## License

This project is private and proprietary.

## Author

Created by Quang

## Support

For support, please contact the development team or submit an issue in the project repository.
# preloadify
