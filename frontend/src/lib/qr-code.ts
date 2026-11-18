/**
 * Helpers to export the invitation QR code (rendered as an SVG by
 * `react-qr-code`) as a PNG image or as a printable poster.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/** Build a file name such as `my-party-qr-code.png` from the game slug. */
export function getQrCodeFileName(slug: string, extension: string): string {
  const base = slug.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
  return `${base || "game"}-qr-code.${extension}`;
}

/** Serialize an SVG element into a standalone SVG document string. */
export function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return new XMLSerializer().serializeToString(clone);
}

/**
 * Render an SVG element into a square PNG blob with a white quiet zone
 * around the code, so it stays scannable once printed.
 */
export function svgToPngBlob(
  svg: SVGSVGElement,
  size: number = 1024,
): Promise<Blob> {
  const source = serializeSvg(svg);
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("Canvas is not supported"));

      const margin = Math.round(size * 0.08);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, size, size);
      context.drawImage(image, margin, margin, size - 2 * margin, size - 2 * margin);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not export the QR code"));
      }, "image/png");
    };
    image.onerror = () => reject(new Error("Could not load the QR code"));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  });
}

/** Trigger a browser download of the given blob. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(href), 0);
}

export interface QrPosterOptions {
  lang: string;
  title: string;
  headline: string;
  instructions: string;
  url: string;
  svg: string;
}

/**
 * Build a self-contained A4 poster (HTML page) that prints the QR code, the
 * game name and the invitation link. Printing it lets the organizer save it
 * as a PDF or stick it at the entrance / on table tents.
 */
export function buildQrPosterHtml({
  lang,
  title,
  headline,
  instructions,
  url,
  svg,
}: QrPosterOptions): string {
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @page { size: A4 portrait; margin: 15mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: #000;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8mm;
  }
  h1 { font-size: 30pt; margin: 0; }
  h2 { font-size: 20pt; margin: 0; font-weight: 600; }
  .qr { width: 130mm; height: 130mm; }
  .qr svg { width: 100%; height: 100%; }
  p { font-size: 14pt; margin: 0; max-width: 150mm; }
  .url { font-family: ui-monospace, monospace; font-size: 11pt; word-break: break-all; }
</style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <h2>${escapeHtml(headline)}</h2>
  <div class="qr">${svg}</div>
  <p>${escapeHtml(instructions)}</p>
  <p class="url">${escapeHtml(url)}</p>
  <script>window.addEventListener("load", function () { window.print(); });</script>
</body>
</html>`;
}
