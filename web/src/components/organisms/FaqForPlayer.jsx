import { STYLES } from "@/constants/styles";
import useTranslation from "next-translate/useTranslation";
import CardSection from "../atoms/CardSection";
import Details from "../atoms/Details";

function FaqSection({ question, answer }) {
  return (
    <Details
      summary={question}
      content={
        <div className="flex flex-col gap-2">
          {answer.split("\n").map((sentence, i) => (
            <p key={i} className="">
              {sentence}
            </p>
          ))}
        </div>
      }
    ></Details>
  );
}

export default function FaqForPlayer() {
  const { t } = useTranslation("faq-for-player");

  return (
    <CardSection>
      <h2 className={STYLES.h2}>{t("title")}</h2>
      {[
        "what_are_the_rules",
        "i_dont_know_target",
        "he_guess_my_card",
        "he_is_not_there",
        "i_m_dead",
        "thats_impossible",
      ].map((key) => (
        <FaqSection key={key} question={t(`items.${key}.summary`)} answer={t(`items.${key}.description`)} />
      ))}
    </CardSection>
  );
}
