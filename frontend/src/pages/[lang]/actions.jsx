import RootLayout from "@/components/templates/layout";

import { LANGS } from "@/lib/i18n";

export default function ActionsPages() {
  return (
    <RootLayout lang={lang}>
      <h1>Actions</h1>
    </RootLayout>
  );
}

/**
 * @type {import("next").GetStaticPaths}
 */
export async function getStaticPaths() {
  return {
    paths: LANGS.map((lang) => ({
      params: { lang },
    })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  // Pass post data to the page via props
  return { props: { lang: params.lang } };
}
