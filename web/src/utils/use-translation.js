import { useContext } from "hono/jsx";
import { LangContext } from "../components/context/LangContext";
import { i18n } from "../lib/i18n";
export function useTranslation(name) {
    const lang = useContext(LangContext);
    function t(key) {
        return i18n(key, { ns: name, lng: lang });
    }
    return { t, lang: "en" };
}
