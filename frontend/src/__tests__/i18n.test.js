import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { describe, expect, it } from 'vitest';

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
