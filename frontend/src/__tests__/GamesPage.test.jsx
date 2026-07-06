import { render } from '@testing-library/react';
import GamesPage from '@/app/[locale]/games/page';

describe('GamesPage', () => {
  it('renders without crashing', async () => {
    const element = await GamesPage({
      params: Promise.resolve({ locale: 'en' }),
    });
    expect(() => render(element)).not.toThrow();
  });
});