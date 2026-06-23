export async function exportMapAsPNG(
  svgEl: SVGSVGElement,
  filename = "life-metro-map.png"
): Promise<void> {
  const W = svgEl.viewBox.baseVal.width;
  const H = svgEl.viewBox.baseVal.height;

  // Clone and stamp explicit pixel dimensions so the serialized SVG renders
  // at the full viewBox size regardless of the element's CSS width/height.
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(W));
  clone.setAttribute("height", String(H));

  const svgString = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.src = url;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
  });

  const scale = 2; // retina
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  // Draw at the explicit viewBox dimensions, not the img's natural size
  ctx.drawImage(img, 0, 0, W, H);
  URL.revokeObjectURL(url);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }, "image/png");
}
