import { t } from "../../locales";

export default function Footer() {
  return (
    <s-box padding="large">
      <s-stack direction="inline" alignItems="center" justifyContent="center">
        <s-paragraph>
          <s-text>{t('dashboard.cards.footer.content')}{' '}</s-text>
          <s-link href="#beep">{t('dashboard.cards.footer.link')}</s-link>
        </s-paragraph>
      </s-stack>
    </s-box>
  );
}