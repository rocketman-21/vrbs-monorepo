import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/atoms/**/*.tsx",
    "../../packages/ui/molecules/**/*.tsx",
    "../../packages/ui/organisms/**/*.tsx",
    "../../packages/ui/governance/**/*.tsx",
    "../../packages/libs/hooks/**/*.ts",
    "../../packages/libs/revolution/**/*.{ts,tsx}",
  ],
  theme: {
    fontFamily: {
      "public-sans": ["var(--font-public-sans)", ...defaultTheme.fontFamily.sans],
      "roboto-mono": ["var(--font-roboto-mono)", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      aspectRatio: {
        "9/16": "9 / 16",
      },

      height: {
        /* @ts-expect-error */
        screen: ["100vh", "100dvh"],
        body: "calc(100vh - 80px)",
      },

      minHeight: {
        /* @ts-expect-error */
        screen: ["100vh", "100dvh"],
      },

      maxHeight: {
        /* @ts-expect-error */
        screen: ["100vh", "100dvh"],
      },

      colors: {
        page: "var(--color-bg)", // page background
        card: "var(--color-card)", // card background
        goal: "var(--color-goal)", // goal background

        lead: {
          50: "var(--color-lead-50)",
          100: "var(--color-lead-100)",
          200: "var(--color-lead-200)",
          300: "var(--color-lead-300)",
          400: "var(--color-lead-400)",
          500: "var(--color-lead-500)",
          600: "var(--color-lead-600)",
          700: "var(--color-lead-700)",
          800: "var(--color-lead-800)",
          900: "var(--color-lead-900)",
          950: "var(--color-lead-950)",
        },

        secondary: {
          50: "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          300: "var(--color-secondary-300)",
          400: "var(--color-secondary-400)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
          950: "var(--color-secondary-950)",
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
    require("tailwind-gradient-mask-image"),
    plugin(({ addVariant }) => {
      addVariant("scroll-lock", '[data-scroll-lock="true"] &');
      addVariant("header-overlay", '[data-header-overlay="true"] &:not(.opaque *)');
    }),
  ],
} satisfies Config;
