import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

const defaultActions = ["action-a", "action-b", "action-c"];

vi.mock("next-intl", () => ({
  useTranslations: vi.fn((namespace) => (key) => key),
  useLocale: vi.fn(() => "en"),
  useMessages: vi.fn(() => ({
    actions: {
      defaultActions,
    },
  })),
  getTranslations: vi.fn(async (namespace) => (key) => key),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  notFound: vi.fn(),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async (namespace) => (key) => key),
}));

vi.mock("@/context/Toast", () => ({
  ToastProvider: ({ children }) =>
    React.createElement(React.Fragment, null, children),
  ToastContext: React.createContext({ push: vi.fn() }),
}));

vi.mock("@/lib/client", () => ({
  client: {
    fetchGame: vi.fn(),
    fetchPlayers: vi.fn(),
    fetchPlayer: vi.fn(),
    createGame: vi.fn(),
    createPlayer: vi.fn(),
    killPlayer: vi.fn(),
    updatePlayer: vi.fn(),
    setupGameListener: vi.fn(() => vi.fn()),
    fetchApplicationStats: vi.fn().mockResolvedValue({
      counts: {
        games_created: 0,
        games_started: 0,
        games_finished: 0,
        players_eliminated: 0,
        players_eliminated_last_6_months: 0,
      },
      version: "1.0.0",
    }),
  },
}));

vi.mock("react-qr-code", () => ({
  __esModule: true,
  default: ({ value }) => <div data-testid="qr-code">{value}</div>,
}));

vi.mock("react-nice-avatar", () => {
  const genConfig = vi.fn(() => ({}));
  return {
    __esModule: true,
    default: ({ name }) => <div data-testid="avatar">{name}</div>,
    genConfig,
  };
});
