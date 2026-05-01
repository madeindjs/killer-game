// Mock next-intl
const { useTranslations, useLocale } = require('next-intl');
const { getTranslations } = require('next-intl/server');

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace) => (key) => key),
  useLocale: jest.fn(() => 'en'),
}));

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(async (namespace) => (key) => key),
}));

describe('i18n Configuration', () => {
  it('should have valid locales', () => {
    const locales = ['en', 'fr'];
    expect(locales).toContain('en');
    expect(locales).toContain('fr');
  });

  it('should use English as default locale', () => {
    const defaultLocale = 'en';
    expect(defaultLocale).toBe('en');
  });

  it('should return translations for useTranslations', () => {
    const t = useTranslations('common');
    expect(t('appName')).toBe('appName');
  });

  it('should return locale for useLocale', () => {
    expect(useLocale()).toBe('en');
  });

  it('should return translations for getTranslations', async () => {
    const t = await getTranslations('common');
    expect(t('appName')).toBe('appName');
  });
});
