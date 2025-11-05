import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { details, references } = body;

    // Validate required fields
    if (!details || details.trim() === "") {
      return Response.json(
        { error: "Details field is required" },
        { status: 400 }
      );
    }

    // Get the Google Sheets webhook URL from environment variables
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("GOOGLE_SHEETS_WEBHOOK_URL is not configured");
      return Response.json(
        { error: "Google Sheets integration is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Prepare the data to send to Google Sheets
    const requestData = {
      shop: session.shop,
      details: details.trim(),
      references: references?.trim() || "",
    };

    // Send the data to Google Sheets via Apps Script
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to save to Google Sheets:", errorText);
      return Response.json(
        { error: "Failed to save feature request. Please try again." },
        { status: 500 }
      );
    }

    const result = await response.json();

    if (!result.success) {
      console.error("Google Sheets returned error:", result.error);
      return Response.json(
        { error: result.error || "Failed to save feature request" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Feature request submitted successfully!",
    });

  } catch (error) {
    console.error("Error submitting feature request:", error);
    return Response.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
};

