import React from 'react';
import { render, screen } from '@testing-library/react';
import GamesPage from '@/app/[locale]/games/page';

describe('GamesPage', () => {
  it('renders without crashing', () => {
    // This test just checks if the page can be rendered
    // The actual components (GamesCreated and GamesJoined) are tested separately
    expect(() => render(<GamesPage />)).not.toThrow();
  });
});
