import { buildQrPosterHtml, escapeHtml, getQrCodeFileName } from "@/lib/qr-code";
import { describe, expect, it } from "vitest";

describe("qr-code helpers", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml(`<b>"Tom" & 'Jerry'</b>`)).toBe(
      "&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;",
    );
  });

  it("builds a file name from the game slug", () => {
    expect(getQrCodeFileName("my-party", "png")).toBe("my-party-qr-code.png");
    expect(getQrCodeFileName("été/2026 !", "png")).toBe("t-2026-qr-code.png");
    expect(getQrCodeFileName("", "png")).toBe("game-qr-code.png");
  });

  it("builds a printable poster with the QR code and the link", () => {
    const html = buildQrPosterHtml({
      lang: "fr",
      title: "<script>alert(1)</script>",
      headline: "Scan to join",
      instructions: "Open your camera",
      url: "https://the-killer.online/join/my-party",
      svg: '<svg data-testid="qr"></svg>',
    });

    expect(html).toContain('<html lang="fr">');
    expect(html).toContain('<svg data-testid="qr"></svg>');
    expect(html).toContain("https://the-killer.online/join/my-party");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("window.print()");
  });
});
