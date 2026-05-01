// jest.setup.js
import '@testing-library/jest-dom';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => (key) => key),
  useLocale: jest.fn(() => 'en'),
  getTranslations: jest.fn(async (namespace) => (key) => key),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  notFound: jest.fn(),
  redirect: jest.fn(),
  permanentRedirect: jest.fn(),
}));

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace) => (key) => key),
}));

// Mock the client module
jest.mock('@/lib/client', () => ({
  client: {
    fetchGame: jest.fn(),
    fetchPlayers: jest.fn(),
  },
}));

// Mock react-qr-code
jest.mock('react-qr-code', () => ({
  __esModule: true,
  default: ({ value }) => <div data-testid="qr-code">{value}</div>,
}));

// Mock react-nice-avatar
jest.mock('react-nice-avatar', () => {
  const genConfig = jest.fn(() => ({}));
  return {
    __esModule: true,
    default: ({ name }) => <div data-testid="avatar">{name}</div>,
    genConfig,
  };
});
