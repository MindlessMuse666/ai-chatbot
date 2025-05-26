import { heroui } from '@heroui/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "foreground-secondary": "var(--foreground-secondary)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "deep-background": "var(--deep-background)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary-foreground)',
              '&:hover': {
                color: 'var(--primary-foreground)',
              },
            },
            h1: {
              color: 'var(--prose-heading)',
            },
            h2: {
              color: 'var(--prose-heading)',
            },
            h3: {
              color: 'var(--prose-heading)',
            },
            h4: {
              color: 'var(--prose-heading)',
            },
            h5: {
              color: 'var(--prose-heading)',
            },
            h6: {
              color: 'var(--prose-heading)',
            },
            strong: {
              color: 'var(--prose-heading)',
            },
            code: {
              color: 'var(--foreground)',
              backgroundColor: 'var(--code-bg)',
            },
            pre: {
              backgroundColor: 'var(--pre-bg)',
              color: 'var(--prose-text)',
            },
            blockquote: {
              color: 'var(--foreground-secondary)',
              borderLeftColor: 'var(--primary-foreground)',
            },
            hr: {
              borderColor: 'var(--prose-border)',
            },
            ol: {
              li: {
                '&::marker': {
                  color: 'var(--foreground-secondary)',
                },
              },
            },
            ul: {
              li: {
                '&::marker': {
                  color: 'var(--foreground-secondary)',
                },
              },
            },
            table: {
              thead: {
                borderBottomColor: 'var(--prose-border)',
              },
              tbody: {
                tr: {
                  borderBottomColor: 'var(--prose-border)',
                },
              },
            },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui(), require('@tailwindcss/typography')],
} satisfies Config;