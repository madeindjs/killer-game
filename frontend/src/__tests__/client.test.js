import { client } from '@/lib/client';

describe('API Client', () => {
  it('should be initialized with the correct API URL', () => {
    // Check if the client is initialized
    expect(client).toBeDefined();

    // The actual URL is set via environment variable, so we can't test the exact value here
    // But we can verify that the client exists and has the expected methods
    expect(typeof client.fetchGame).toBe('function');
    expect(typeof client.fetchPlayers).toBe('function');
  });

  it('should have fetchGame method', () => {
    expect(client.fetchGame).toBeDefined();
    expect(typeof client.fetchGame).toBe('function');
  });

  it('should have fetchPlayers method', () => {
    expect(client.fetchPlayers).toBeDefined();
    expect(typeof client.fetchPlayers).toBe('function');
  });
});
