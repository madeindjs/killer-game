import B2BLeadForm from "@/components/organisms/B2BLeadForm";
import Testimonials from "@/components/organisms/Testimonials";
import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

const BENEFIT_KEYS = ["noLogistics", "lastMinute", "customizable", "realTime"] as const;
const COMPARISON_ROWS = ["delivery", "stock", "delay", "price", "custom", "tracking"] as const;
const STEP_KEYS = ["step1", "step2", "step3"] as const;

export default async function TeamBuildingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TeamBuildingView />;
}

function TeamBuildingView() {
  const t = useTranslations("b2b");

  return (
    <>
      <section className="relative overflow-hidden bg-base-200/40">
        <div className="container mx-auto px-4 max-w-6xl py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="badge badge-primary badge-lg mb-4">
              B2B / Team building
            </span>
            <h1 className={STYLES.h1}>{t("hero.headline")}</h1>
            <p className="text-xl md:text-2xl opacity-90 mt-4">
              {t("hero.subhead")}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#lead-form" className="btn btn-primary btn-lg">
                {t("hero.cta")}
              </a>
              <a href="#how-it-works" className="btn btn-outline btn-lg">
                {t("hero.secondaryCta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={STYLES.section}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={STYLES.h2}>{t("benefits.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFIT_KEYS.map((key) => (
              <div
                key={key}
                className="card bg-base-100 shadow-xl border border-base-200"
              >
                <div className="card-body">
                  <h3 className={STYLES.h3}>{t(`benefits.items.${key}.title`)}</h3>
                  <p className={STYLES.paragraph}>
                    {t(`benefits.items.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={STYLES.section + " bg-base-200/50"}>
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className={STYLES.h2}>{t("comparison.title")}</h2>
            <p className={STYLES.paragraph}>{t("comparison.subtitle")}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th />
                  <th className="text-primary">{t("comparison.digitalCol")}</th>
                  <th className="opacity-70">{t("comparison.physicalCol")}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row}>
                    <th className="font-semibold">
                      {t(`comparison.rows.${row}.digital`)}
                    </th>
                    <td className="text-primary">
                      ✅ {t(`comparison.rows.${row}.digital`)}
                    </td>
                    <td className="opacity-70">
                      ✕ {t(`comparison.rows.${row}.physical`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="how-it-works" className={STYLES.section}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className={STYLES.h2}>{t("howItWorks.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEP_KEYS.map((key, index) => (
              <div
                key={key}
                className="card bg-base-100 shadow-xl border border-base-200"
              >
                <div className="card-body items-center text-center">
                  <div className="text-4xl font-extrabold text-primary opacity-80">
                    {index + 1}
                  </div>
                  <h3 className={STYLES.h3}>{t(`howItWorks.steps.${key}.title`)}</h3>
                  <p className={STYLES.paragraph}>
                    {t(`howItWorks.steps.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials namespace="b2b.testimonials" />

      <section id="lead-form" className={STYLES.section + " bg-base-200/50"}>
        <div className="container mx-auto px-4 max-w-2xl">
          <B2BLeadForm />
        </div>
      </section>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "b2b" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}