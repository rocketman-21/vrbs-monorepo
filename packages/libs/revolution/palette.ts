import {
  amber,
  blue,
  cyan,
  emerald,
  fuchsia,
  gray,
  green,
  indigo,
  lime,
  neutral,
  orange,
  pink,
  purple,
  red,
  rose,
  sky,
  slate,
  stone,
  teal,
  violet,
  white,
  yellow,
  zinc,
} from "tailwindcss/colors";

const ADDITIONAL_COLORS = {
  brown: {
    50: "#F9E9E1",
    100: "#F3D3C4",
    200: "#E7A888",
    300: "#DB7C4D",
    400: "#BA5726",
    500: "#803C1A",
    600: "#663015",
    700: "#4C2410",
    800: "#33180A",
    900: "#190C05",
    950: "#0D0603",
  },
  noir: {
    50: "#e0e0e0",
    100: "#bdbdbd",
    200: "#9e9e9e",
    300: "#757575",
    400: "#616161",
    500: "#424242",
    600: "#303030",
    700: "#212121",
    800: "#121212",
    900: "#000000",
    950: "#000000",
  },
};

const tailwindColors = {
  amber,
  blue,
  cyan,
  emerald,
  fuchsia,
  gray,
  green,
  indigo,
  lime,
  neutral,
  orange,
  pink,
  purple,
  red,
  rose,
  sky,
  slate,
  stone,
  teal,
  violet,
  yellow,
  zinc,
  ...ADDITIONAL_COLORS,
};

export type ITailwindPalette = keyof typeof tailwindColors | keyof typeof ADDITIONAL_COLORS;

export type IBackgroundPattern = {
  color: ITailwindPalette;
  width?: number;
  height?: number;
  opacity?: number;
  rotate?: number;
};

export function getStylesForPalette(palette: ITailwindPalette, type: "lead" | "secondary") {
  const colors = tailwindColors[palette];
  if (typeof colors === "string") {
    throw new Error("Invalid palette name.");
  }

  return getPaletteStyle(colors, type);
}

export function getStylesForBackgroundPattern(config: IBackgroundPattern | null) {
  if (!config) return {};

  const { color, width = 140, height = 100, opacity = 0.04, rotate = -25 } = config;

  const fill = tailwindColors[color][500].replace("#", "%23");

  return {
    backgroundImage: `url("data:image/svg+xml,%3Csvg fill='none' height='60' transform='rotate(${rotate})' opacity='${opacity}' shape-rendering='crispEdges' viewBox='0 0 160 60' width='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${fill}'%3E%3Cpath d='m90 0h-60v10h60z'/%3E%3Cpath d='m160 0h-60v10h60z'/%3E%3Cpath d='m40 10h-10v10h10z'/%3E%3C/g%3E%3Cpath d='m60 10h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m80 10h-20v10h20z' fill='%23000'/%3E%3Cpath d='m90 10h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m110 10h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m130 10h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m150 10h-20v10h20z' fill='%23000'/%3E%3Cpath d='m160 10h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m40 20h-40v10h40z' fill='${fill}'/%3E%3Cpath d='m60 20h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m80 20h-20v10h20z' fill='%23000'/%3E%3Cpath d='m110 20h-30v10h30z' fill='${fill}'/%3E%3Cpath d='m130 20h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m150 20h-20v10h20z' fill='%23000'/%3E%3Cpath d='m160 20h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m10 30h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m40 30h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m60 30h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m80 30h-20v10h20z' fill='%23000'/%3E%3Cpath d='m90 30h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m110 30h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m130 30h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m150 30h-20v10h20z' fill='%23000'/%3E%3Cpath d='m160 30h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m10 40h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m40 40h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m60 40h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m80 40h-20v10h20z' fill='%23000'/%3E%3Cpath d='m90 40h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m110 40h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m130 40h-20v10h20z' fill='%23fff'/%3E%3Cpath d='m150 40h-20v10h20z' fill='%23000'/%3E%3Cpath d='m160 40h-10v10h10z' fill='${fill}'/%3E%3Cpath d='m90 50h-60v10h60z' fill='${fill}'/%3E%3Cpath d='m160 50h-60v10h60z' fill='${fill}'/%3E%3C/svg%3E")`,
    backgroundSize: `${width}px ${height}px`,
    backgroundRepeat: "space",
    backgroundAttachment: "fixed",
  };
}

function getPaletteStyle(colors: Record<string, string>, type: "lead" | "secondary") {
  return Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [`--color-${type}-${name}`, value]),
  );
}

export function getPalette(color: keyof typeof tailwindColors) {
  return tailwindColors[color];
}

export interface RevolutionPalette {
  light: RevolutionPaletteColors;
  dark: RevolutionPaletteColors;
}

interface RevolutionPaletteColors {
  background: string;
  card: string;
  lead: ITailwindPalette;
  secondary: ITailwindPalette;
}

export function getPaletteCSS(palette: RevolutionPalette): string {
  const { light, dark } = palette;

  return `
    html.dark {
      --color-card: ${dark.card};
      --color-bg: ${dark.background};
      ${Object.entries(getStylesForPalette(dark.lead, "lead"))
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n")}      
      ${Object.entries(getStylesForPalette(dark.secondary, "secondary"))
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n")}        
    }
    html.light {
      --color-card: ${light.card};
      --color-bg: ${light.background};
      ${Object.entries(getStylesForPalette(light.lead, "lead"))
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n")}      
      ${Object.entries(getStylesForPalette(light.secondary, "secondary"))
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n")}        
    }    
  `;
}
