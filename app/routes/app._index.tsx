import { useEffect } from "react";
import type {
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
// import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import Footer from "../components/dashboard/Footer";
import AppExtension from "../components/dashboard/AppExtension";
import ActivatedPreloader from "../components/dashboard/ActivatedPreloader";
import SupportChannels from "../components/dashboard/SupportChannels";
import Changelog from "../components/dashboard/Changelog";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

export default function Index() {
  const shopify = useAppBridge();

  return (
    <s-page heading="Dashboard">
      <AppExtension/>
      <ActivatedPreloader/>
      <SupportChannels/>
      <Changelog/>
      <Footer/>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
