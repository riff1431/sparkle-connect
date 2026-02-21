import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2?family=";

interface TypographySettings {
  global_font?: string;
  heading_font?: string;
  body_font?: string;
  heading_size_h1?: string;
  heading_size_h2?: string;
  heading_size_h3?: string;
  body_size?: string;
  small_text_size?: string;
}

const TYPOGRAPHY_KEYS = [
  "global_font",
  "heading_font",
  "body_font",
  "heading_size_h1",
  "heading_size_h2",
  "heading_size_h3",
  "body_size",
  "small_text_size",
];

function loadGoogleFont(font: string, linkId: string) {
  const fontFamily = font.replace(/ /g, "+");
  let link = document.getElementById(linkId) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  link.href = `${GOOGLE_FONTS_BASE}${fontFamily}:wght@300;400;500;600;700;800&display=swap`;
}

const GlobalFontProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<TypographySettings>({});

  useEffect(() => {
    supabase
      .from("theme_settings")
      .select("setting_key, setting_value")
      .in("setting_key", TYPOGRAPHY_KEYS)
      .then(({ data }) => {
        if (data) {
          const map: TypographySettings = {};
          data.forEach((row) => {
            if (row.setting_value) {
              (map as any)[row.setting_key] = row.setting_value;
            }
          });
          setSettings(map);
        }
      });
  }, []);

  useEffect(() => {
    const { global_font, heading_font, body_font, heading_size_h1, heading_size_h2, heading_size_h3, body_size, small_text_size } = settings;

    // Resolve fonts: specific overrides global
    const resolvedHeading = heading_font || global_font;
    const resolvedBody = body_font || global_font;

    if (resolvedHeading) {
      loadGoogleFont(resolvedHeading, "dynamic-heading-font");
      document.documentElement.style.setProperty("--font-heading", `"${resolvedHeading}", sans-serif`);
    }
    if (resolvedBody) {
      loadGoogleFont(resolvedBody, "dynamic-body-font");
      document.documentElement.style.setProperty("--font-sans", `"${resolvedBody}", sans-serif`);
    }

    // Apply font sizes via CSS custom properties
    const styleId = "dynamic-typography-styles";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      ${heading_size_h1 ? `h1 { font-size: ${heading_size_h1}px !important; }` : ""}
      ${heading_size_h2 ? `h2 { font-size: ${heading_size_h2}px !important; }` : ""}
      ${heading_size_h3 ? `h3, h4, h5, h6 { font-size: ${heading_size_h3}px !important; }` : ""}
      ${body_size ? `p, span, div, li, td, th, label, a { font-size: ${body_size}px; }` : ""}
      ${small_text_size ? `.text-xs, .text-sm, small, caption { font-size: ${small_text_size}px !important; }` : ""}
      ${resolvedHeading ? `h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }` : ""}
      ${resolvedBody ? `body, p, span, div, li, td, th, label, a, input, textarea, select, button { font-family: var(--font-sans); }` : ""}
    `;
  }, [settings]);

  return <>{children}</>;
};

export default GlobalFontProvider;
