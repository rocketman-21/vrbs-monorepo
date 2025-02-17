"use server";

export async function optimizeSvg(svgString: string) {
  try {
    const { optimize } = await import("svgo");
    const result = optimize(svgString, {
      multipass: true,
      plugins: [
        "removeDimensions",
        {
          name: "addAttributesToSVGElement",
          params: {
            attributes: [
              { "shape-rendering": "crispEdges" },
              { width: "2048" },
              { height: "2048" },
            ],
          },
        },
      ],
      datauri: "base64",
    });

    const sizeBefore = svgString.length;
    const sizeAfter = result.data.length;
    const sizeDiff = sizeBefore - sizeAfter;

    const percentageSavings = ((sizeDiff / sizeBefore) * 100).toFixed(2);
    console.debug(
      `Optimized SVG file: ${sizeDiff} bytes saved (${percentageSavings}%). New size: ${sizeAfter} bytes.`,
    );

    return result.data;
  } catch (e: any) {
    console.error("Error optimizing SVG", e.message);
    return svgString; // return unoptimized if error
  }
}
