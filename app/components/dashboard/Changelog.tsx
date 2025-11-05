import { t } from "../../locales";

export default function Changelog() {
    return (
        <s-section heading={t('dashboard.cards.changelog.title')}>
            <s-stack gap="base">
            <s-stack gap="small-300">
                <s-heading>Latest version</s-heading>
                <s-unordered-list>
                <s-list-item>Version 1.0.0</s-list-item>
                <s-list-item>Version 1.0.1</s-list-item>
                <s-list-item>Blue shirt</s-list-item>
                </s-unordered-list>
            </s-stack>
            <s-stack gap="small-300">
                <s-heading>Latest version</s-heading>
                <s-unordered-list>
                <s-list-item>Version 1.0.0</s-list-item>
                <s-list-item>Version 1.0.1</s-list-item>
                <s-list-item>Blue shirt</s-list-item>
                </s-unordered-list>
            </s-stack>
            </s-stack>
        </s-section>
    );
}