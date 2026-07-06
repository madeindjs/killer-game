import PlayerAvatar from "@/components/molecules/PlayerAvatar";
import { STYLES } from "@/constants/styles";
import { PlayerRecord } from "@killer-game/types";
import { useTranslations } from "next-intl";

interface TestimonialsProps {
  namespace?: string;
  count?: number;
}

export default function Testimonials({
  namespace = "homepage.Feedbacks",
  count = 3,
}: TestimonialsProps) {
  const t = useTranslations(namespace);

  const feedbacks = Array.from({ length: count }, (_, i) => ({
    content: t(`feedback${i + 1}.content`),
    name: t(`feedback${i + 1}.name`),
  }));

  return (
    <section className={STYLES.section}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className={STYLES.h2}>{t("title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {feedbacks.map((feedback, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-xl border border-base-200"
            >
              <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                  <PlayerAvatar
                    player={{ name: feedback.name } as PlayerRecord}
                  />
                </div>
                <p className="text-lg italic opacity-90 mb-4">
                  “{feedback.content}”
                </p>
                <p className="font-bold text-primary">{feedback.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}