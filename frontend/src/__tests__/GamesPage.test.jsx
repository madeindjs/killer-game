import React from 'react';
import { render, screen } from '@testing-library/react';
import GamesPage from '@/app/[locale]/games/page';
import GamesCreated from '@/components/pages/GamesCreated';
import GamesJoined from '@/components/pages/GamesJoined';

// Mock child components
jest.mock('@/components/pages/GamesCreated', () => () => <div data-testid="games-created">GamesCreated</div>);
jest.mock('@/components/pages/GamesJoined', () => () => <div data-testid="games-joined">GamesJoined</div>);

describe('GamesPage', () => {
  it('renders the GamesCreated and GamesJoined components', () => {
    render(<GamesPage />);

    expect(screen.getByTestId('games-created')).toBeInTheDocument();
    expect(screen.getByTestId('games-joined')).toBeInTheDocument();
  });
});
