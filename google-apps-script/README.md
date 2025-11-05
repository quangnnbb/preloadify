# Google Apps Script Setup for Feature Requests

This folder contains the Google Apps Script code that receives feature requests from the Preloadify app and saves them to Google Sheets.

## Setup Instructions

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Preloadify Feature Requests" (or any name you prefer)
4. Keep this sheet tab open

### 2. Deploy the Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `Code.gs` from this folder
4. Paste it into the Apps Script editor
5. Click the **Save** icon (or press Ctrl+S / Cmd+S)
6. Name your project "Preloadify Feature Requests Handler"

### 3. Deploy as Web App

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
6. Copy the **Web app URL** (it looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 4. Configure Your Shopify App

1. Open your Shopify app's environment variables (`.env` file for local development)
2. Add this line:
   ```bash
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Replace with your actual Web app URL from step 3

### 5. Test the Integration

#### Test from Apps Script Editor

1. In the Apps Script editor, select the `testFeatureRequest` function from the dropdown
2. Click the **Run** button
3. Check your Google Sheet - you should see a new row with test data

#### Test from Your Shopify App

1. Start your development server: `npm run dev`
2. Open the app in a browser
3. Navigate to the Dashboard
4. Click **Feature Request** in the Support Channels section
5. Fill out the form and click Send
6. Check your Google Sheet - a new row should appear with the submitted data

## Sheet Structure

The script will automatically create these columns on the first request:

| Timestamp | Shop | Details | References |
|-----------|------|---------|------------|
| 2025-10-17 10:30:00 | shop1.myshopify.com | Feature description... | Links or N/A |

## Troubleshooting

### "Script not authorized" error

- Make sure you clicked "Allow" when authorizing the script
- Check that "Who has access" is set to "Anyone"

### No data appearing in sheet

- Verify the Web app URL is correct in your `.env` file
- Check the Apps Script logs: Click **Executions** in the left sidebar
- Make sure the Google Sheet is the one where you deployed the script

### "Missing required fields" error

- Ensure both `shop` and `details` are being sent in the request
- Check the network tab in browser dev tools to see the actual request

## Updating the Script

If you need to modify the script:

1. Make changes in the Apps Script editor
2. Save the changes
3. Click **Deploy** > **Manage deployments**
4. Click the edit icon (pencil) next to your deployment
5. Change the version to "New version"
6. Click **Deploy**

Note: The Web app URL stays the same, so you don't need to update your environment variables.

## Security Notes

- The Web app URL is public, but it only accepts POST requests with specific data
- Anyone with the URL can submit feature requests (this is intentional for the app)
- If you need authentication, you can modify the script to check for an API key
- The sheet is private to your Google account unless you explicitly share it

## Features

- ✅ Automatic header creation on first request
- ✅ Timestamp for each request
- ✅ Auto-resize columns for readability
- ✅ Formatted header row (blue background, white text)
- ✅ Error handling and logging
- ✅ Test function included
- ✅ GET endpoint for health checks

