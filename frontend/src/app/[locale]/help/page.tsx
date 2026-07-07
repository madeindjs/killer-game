import FaqForPlayer from "@/components/organisms/FaqForPlayer";
import GameTutorialExample from "@/components/organisms/GameTutorialExample";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { buildAlternates, OPEN_GRAPH_DEFAULTS, SITE_URL, TWITTER_DEFAULTS } from "@/lib/seo";

const FAQ_KEYS = [
  "what_are_the_rules",
  "i_dont_know_target",
  "he_guess_my_card",
  "he_is_not_there",
  "i_m_dead",
  "thats_impossible",
] as const;

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq-for-player" });
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.summary`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.description`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <HelpView />
    </>
  );
}

function HelpView() {
  const t = useTranslations("help");

  return (
    <>
      <h1 className={STYLES.h1}>{t("title")}</h1>
      <p className="mb-16">{t("headline")}</p>
      <div className="mb-16">
        <GameTutorialExample />
      </div>

      <FaqForPlayer />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "help" });
  const title = t("metaTitle");
  const description = t("metaDescription");

  return {
    title,
    description,
    alternates: buildAlternates("help").alternates,
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      locale,
      title,
      description,
      url: `${SITE_URL}/${locale}/help`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title,
      description,
    },
  };
}
