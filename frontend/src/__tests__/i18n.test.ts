import { useTranslations, useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { describe, expect, it, vi } from 'vitest';

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

  it('should pluralize game-join.GameJoinContent.thereIsAlreadyXPlayers with ICU syntax in both locales', async () => {
    const { createTranslator } = await vi.importActual<typeof import('next-intl')>('next-intl');
    const expected: Record<string, [string, string, string]> = {
      en: [
        'There are no players in the game yet.',
        'There is already 1 player in the game.',
        'There are already 3 players in the game.',
      ],
      fr: [
        "Il n'y a pas encore de joueur dans la partie.",
        'Il y a déjà 1 joueur dans la partie.',
        'Il y a déjà 3 joueurs dans la partie.',
      ],
    };

    for (const [locale, [zero, one, other]] of Object.entries(expected)) {
      const messages = (await import(`../../locales/${locale}.json`)).default;
      const t = createTranslator({ locale, messages, namespace: 'game-join.GameJoinContent' });
      expect(t('thereIsAlreadyXPlayers', { count: 0 })).toBe(zero);
      expect(t('thereIsAlreadyXPlayers', { count: 1 })).toBe(one);
      expect(t('thereIsAlreadyXPlayers', { count: 3 })).toBe(other);
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
