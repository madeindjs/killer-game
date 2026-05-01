import React from 'react';
import Page from '@/app/[locale]/games/[gameId]/page';
import { client } from '@/lib/client';
import { notFound, redirect } from 'next/navigation';

// Mock the client
jest.mock('@/lib/client', () => ({
  client: {
    fetchGame: jest.fn(),
    fetchPlayers: jest.fn(),
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

describe('GameDashboardPage', () => {
  const mockGame = {
    id: 'game-123',
    private_token: 'token-123',
  };

  const mockPlayers = [
    { id: 'player-1', name: 'Player 1' },
    { id: 'player-2', name: 'Player 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches game and players successfully', async () => {
    client.fetchGame.mockResolvedValue(mockGame);
    client.fetchPlayers.mockResolvedValue(mockPlayers);

    const params = { gameId: 'game-123' };
    const searchParams = { password: 'password-123' };

    await Page({
      params: Promise.resolve(params),
      searchParams: Promise.resolve(searchParams),
    });

    expect(client.fetchGame).toHaveBeenCalledWith('game-123', 'password-123');
    expect(client.fetchPlayers).toHaveBeenCalledWith('game-123', 'token-123');
  });

  it('returns notFound if game is not found', async () => {
    client.fetchGame.mockResolvedValue(null);

    const params = { gameId: 'game-123' };
    const searchParams = { password: 'password-123' };

    await Page({
      params: Promise.resolve(params),
      searchParams: Promise.resolve(searchParams),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it('redirects if game has no private_token', async () => {
    const gameWithoutToken = { id: 'game-123', private_token: null };
    client.fetchGame.mockResolvedValue(gameWithoutToken);

    const params = { gameId: 'game-123' };
    const searchParams = { password: 'password-123' };

    await Page({
      params: Promise.resolve(params),
      searchParams: Promise.resolve(searchParams),
    });

    expect(redirect).toHaveBeenCalledWith('/');
  });
});
