import { useState, useEffect, useCallback } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { t } from "../../locales";

export default function SupportChannels() {
  const shopify = useAppBridge();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log("Already submitting, ignoring duplicate request");
      return;
    }

    // Get form values
    const detailsElement = document.querySelector('#feature-request-modal s-text-area') as any;
    const referencesElement = document.querySelector('#feature-request-modal s-text-field') as any;
    
    const details = detailsElement?.value?.trim();
    const references = referencesElement?.value?.trim();

    // Validate
    if (!details) {
      shopify.toast.show(t('dashboard.cards.support.modal.errors.required'), {
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting feature request:", { details, references });
      
      const response = await fetch("/api/feature-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          details,
          references,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok && result.success) {
        shopify.toast.show(t('dashboard.cards.support.modal.success'));
        
        // Clear form on success
        if (detailsElement) detailsElement.value = "";
        if (referencesElement) referencesElement.value = "";
      } else {
        console.error("Request failed:", result);
        shopify.toast.show(result.error || t('dashboard.cards.support.modal.errors.generic'), {
          isError: true,
        });
      }
    } catch (error) {
      console.error("Error submitting feature request:", error);
      shopify.toast.show(t('dashboard.cards.support.modal.errors.network'), {
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
      
      // Close modal after any submission attempt (success or failure)
      const modalElement = document.getElementById('feature-request-modal') as any;
      if (modalElement) {
        modalElement.hide();
      }
    }
  }, [shopify, isSubmitting]);

  useEffect(() => {
    // Attach event listener to the submit button
    const submitButton = document.querySelector('#feature-request-submit-btn');
    if (submitButton) {
      submitButton.addEventListener('click', handleSubmit);
    }

    return () => {
      if (submitButton) {
        submitButton.removeEventListener('click', handleSubmit);
      }
    };
  }, [handleSubmit]);

  return (
    <s-section heading={t('dashboard.cards.support.title')}>
      <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="base">
        <s-clickable
          border="base"
          padding="base"
          borderRadius="base"
          href="https://docs.saleshunterthemes.com"
        >
          <s-stack direction="inline" gap="small-200">
            <s-icon type="question-circle" />
            <s-text>{t('dashboard.cards.support.actions.help')}</s-text>
          </s-stack>
        </s-clickable>
        <s-clickable
          border="base"
          padding="base"
          borderRadius="base"
          href="https://saleshunterthemes.com/"
        >
          <s-stack direction="inline" gap="small-200">
            <s-icon type="chat-new" />
            <s-text>{t('dashboard.cards.support.actions.chat')}</s-text>
          </s-stack>
        </s-clickable>
        <s-clickable
          border="base"
          padding="base"
          borderRadius="base"
          commandFor="feature-request-modal"
        >
          <s-stack direction="inline" gap="small-200">
            <s-icon type="sun" />
            <s-text>{t('dashboard.cards.support.actions.request')}</s-text>
          </s-stack>
        </s-clickable>
      </s-grid>
      <s-modal 
        id="feature-request-modal" 
        heading={t('dashboard.cards.support.modal.heading')}
      >
        <s-stack gap="small">
          <s-text-area
            label={t('dashboard.cards.support.modal.labels.details')}
            details={t('dashboard.cards.support.modal.contents.details')}
            rows={8}
            autocomplete="off"
            required
          />
          <s-text-field
            label={t('dashboard.cards.support.modal.labels.references')}
            autocomplete="off"
            details={t('dashboard.cards.support.modal.contents.references')}
          />
        </s-stack>
        <s-button 
          slot="secondary-actions" 
          commandFor="feature-request-modal" 
          command="--hide"
          disabled={isSubmitting}
        >
          {t('dashboard.cards.support.modal.actions.cancel')}
        </s-button>
        <s-button
          id="feature-request-submit-btn"
          slot="primary-action"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('dashboard.cards.support.modal.actions.sending') : t('dashboard.cards.support.modal.actions.send')}
        </s-button>
      </s-modal>
    </s-section>
  );
}