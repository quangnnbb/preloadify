/**
 * Google Apps Script for Preloadify Feature Requests
 * 
 * Instructions:
 * 1. Open your Google Sheet for feature requests
 * 2. Go to Extensions > Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Save the project (Ctrl+S or Cmd+S)
 * 5. Click Deploy > New deployment
 * 6. Choose "Web app" as the deployment type
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click Deploy
 * 10. Copy the Web App URL (this is your GOOGLE_SHEETS_WEBHOOK_URL)
 * 11. Add the URL to your app's environment variables
 */

/**
 * Handle POST requests from the Shopify app
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.shop || !data.details) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Missing required fields: shop and details are required'
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if this is the first entry (add headers if needed)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Shop', 'Details', 'References']);
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 4);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const shop = data.shop;
    const details = data.details;
    const references = data.references || 'N/A';
    
    // Append the new row
    sheet.appendRow([timestamp, shop, details, references]);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 4);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Feature request saved successfully',
      timestamp: timestamp.toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error and return error response
    Logger.log('Error processing feature request: ' + error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing purposes)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Preloadify Feature Request API is working!',
    note: 'This endpoint accepts POST requests with shop, details, and references fields.'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify the setup
 * Run this from the Apps Script editor to test
 */
function testFeatureRequest() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        shop: 'test-store.myshopify.com',
        details: 'This is a test feature request',
        references: 'https://example.com'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}

