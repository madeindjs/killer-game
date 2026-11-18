import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { KillerClient } from "@killer-game/client";

class FakeEventSource {
  static urls: string[] = [];
  onmessage: ((event: MessageEvent) => void) | null = null;
  constructor(url: string) {
    FakeEventSource.urls.push(url);
  }
  close() {}
}

describe("KillerClient.setupGameListener", () => {
  beforeEach(() => {
    FakeEventSource.urls = [];
    vi.stubGlobal("EventSource", FakeEventSource);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("opens an anonymous stream by default", () => {
    new KillerClient("http://api.test").setupGameListener("game-1", vi.fn());

    expect(FakeEventSource.urls).toEqual(["http://api.test/games/game-1/sse"]);
  });

  it("identifies the player in the query string", () => {
    new KillerClient("http://api.test").setupGameListener("game-1", vi.fn(), {
      id: "p1",
      private_token: "tok en",
    });

    expect(FakeEventSource.urls).toEqual(["http://api.test/games/game-1/sse?player_id=p1&token=tok+en"]);
  });
});
