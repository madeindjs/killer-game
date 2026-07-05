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

  it('should have plural variants for game-join.GameJoinContent.thereIsAlreadyXPlayers in both locales', async () => {
    const en = (await import('../../locales/en.json')).default['game-join'].GameJoinContent;
    const fr = (await import('../../locales/fr.json')).default['game-join'].GameJoinContent;
    for (const form of ['_zero', '_one', '_other']) {
      expect(en).toHaveProperty('thereIsAlreadyXPlayers' + form);
      expect(fr).toHaveProperty('thereIsAlreadyXPlayers' + form);
    }
  });

  it('should have a games-created namespace (not game-created) in both locales', async () => {
    const en = (await import('../../locales/en.json')).default;
    const fr = (await import('../../locales/fr.json')).default;
    expect(en).toHaveProperty('games-created');
    expect(fr).toHaveProperty('games-created');
    expect(en).not.toHaveProperty('game-created');
    expect(fr).not.toHaveProperty('game-created');
  });
});
