import { STYLES } from "@/constants/styles";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ReactNode } from "react";

const TOKEN_PLACEHOLDER = "YOUR_GAME_PRIVATE_TOKEN";
const PRODUCTION_MCP_URL = "https://api.the-killer.online/mcp";
const DEVELOPMENT_MCP_URL = "http://localhost:3001/mcp";

function Markup({
  i18nKey,
  values,
}: {
  i18nKey: string;
  values?: Record<string, string>;
}) {
  const t = useTranslations("ai");
  const html = t.markup(i18nKey, {
    ...values,
    b: (chunks: string) => `<strong class="text-primary">${chunks}</strong>`,
    code: (chunks: string) =>
      `<code class="px-1 rounded font-mono text-sm">${chunks}</code>`,
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className={STYLES.h2}>{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-base-300 p-4 rounded-lg overflow-x-auto text-sm my-3">
      <code className="font-mono whitespace-pre">{children}</code>
    </pre>
  );
}

function SetupCard({
  title,
  body,
  code,
}: {
  title: string;
  body: ReactNode;
  code?: string;
}) {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 mb-6">
      <div className="card-body">
        <h3 className={STYLES.h3}>{title}</h3>
        <div className={STYLES.PARAGRAPHS}>{body}</div>
        {code ? <CodeBlock>{code}</CodeBlock> : null}
      </div>
    </div>
  );
}

function ToolItem({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return (
    <li>
      <code className="px-1 rounded font-mono text-sm">{name}</code>
      <span className="ml-2">{description}</span>
    </li>
  );
}

export default function AiDocsPage() {
  const t = useTranslations("ai");
  const apiDocsUrl = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/docs`
    : "http://localhost:3001/docs";

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12">
      <h1 className={STYLES.h1}>{t("title")}</h1>
      <p className={STYLES.paragraph + " mb-8"}>{t("headline")}</p>

      <Section title={t("whatIsMcp.title")}>
        <Markup i18nKey="whatIsMcp.body" />
      </Section>

      <Section title={t("endpoint.title")}>
        <Markup i18nKey="endpoint.body" />
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <h3 className={STYLES.h3}>{t("endpoint.production")}</h3>
            <CodeBlock>{PRODUCTION_MCP_URL}</CodeBlock>
          </div>
          <div>
            <h3 className={STYLES.h3}>{t("endpoint.development")}</h3>
            <CodeBlock>{DEVELOPMENT_MCP_URL}</CodeBlock>
          </div>
        </div>
      </Section>

      <Section title={t("authentication.title")}>
        <Markup i18nKey="authentication.body" />
        <div className="alert alert-info mt-4">
          <Markup i18nKey="authentication.hint" />
        </div>
      </Section>

      <Section title={t("tools.title")}>
        <Markup i18nKey="tools.body" />
        <ul className="list-disc pl-6 mt-4 space-y-1">
          <ToolItem name="create_game" description={t("tools.create_game")} />
          <ToolItem name="get_game" description={t("tools.get_game")} />
          <ToolItem name="update_game" description={t("tools.update_game")} />
          <ToolItem name="start_game" description={t("tools.start_game")} />
          <ToolItem name="delete_game" description={t("tools.delete_game")} />
          <ToolItem name="list_players" description={t("tools.list_players")} />
          <ToolItem name="add_player" description={t("tools.add_player")} />
          <ToolItem
            name="update_player"
            description={t("tools.update_player")}
          />
          <ToolItem
            name="remove_player"
            description={t("tools.remove_player")}
          />
        </ul>
      </Section>

      <Section title={t("setup.title")}>
        <Markup
          i18nKey="setup.intro"
          values={{ tokenPlaceholder: TOKEN_PLACEHOLDER }}
        />

        <SetupCard
          title={t("setup.claudeCode.title")}
          body={<Markup i18nKey="setup.claudeCode.body" />}
          code={`{
  "mcpServers": {
    "killer-game": {
      "type": "http",
      "url": "${PRODUCTION_MCP_URL}",
      "headers": {
        "Authorization": "${TOKEN_PLACEHOLDER}"
      }
    }
  }
}`}
        />

        <SetupCard
          title={t("setup.claudeDesktop.title")}
          body={<Markup i18nKey="setup.claudeDesktop.body" />}
          code={`{
  "mcpServers": {
    "killer-game": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${PRODUCTION_MCP_URL}",
        "--header",
        "Authorization:\${MCP_AUTH_TOKEN}"
      ],
      "env": {
        "MCP_AUTH_TOKEN": "${TOKEN_PLACEHOLDER}"
      }
    }
  }
}`}
        />

        <SetupCard
          title={t("setup.cursor.title")}
          body={<Markup i18nKey="setup.cursor.body" />}
          code={`{
  "mcpServers": {
    "killer-game": {
      "url": "${PRODUCTION_MCP_URL}",
      "headers": {
        "Authorization": "${TOKEN_PLACEHOLDER}"
      }
    }
  }
}`}
        />

        <SetupCard
          title={t("setup.mistral.title")}
          body={<Markup i18nKey="setup.mistral.body" />}
        />

        <SetupCard
          title={t("setup.generic.title")}
          body={<Markup i18nKey="setup.generic.body" />}
          code={`{
  "url": "${PRODUCTION_MCP_URL}",
  "headers": {
    "Authorization": "${TOKEN_PLACEHOLDER}"
  }
}`}
        />

        <p className="text-sm opacity-80 mt-6">
          <Markup i18nKey="setup.restart" />
        </p>
      </Section>

      <Section title={t("security.title")}>
        <Markup i18nKey="security.body" />
      </Section>

      <Section title={t("links.title")}>
        <div className="flex flex-col gap-2">
          <a
            href={apiDocsUrl}
            className="link link-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("links.apiDocs")} →
          </a>
          <Link href="/llms.txt" className="link link-primary">
            {t("links.llmsTxt")} →
          </Link>
        </div>
      </Section>
    </div>
  );
}

export async function generateMetadata() {
  const t = await getTranslations("ai");
  return {
    title: t("title"),
    description: t("headline"),
  };
}
