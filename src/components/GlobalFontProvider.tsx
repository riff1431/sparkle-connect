import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const GOOGLE_FONTS_BASE = "https://fonts.googleapis.com/css2?family=";

const GlobalFontProvider = ({ children }: { children: React.ReactNode }) => {
  const [font, setFont] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("theme_settings")
      .select("setting_value")
      .eq("setting_key", "global_font")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.setting_value) {
          setFont(data.setting_value);
        }
      });
  }, []);

  useEffect(() => {
    if (!font) return;

    // Load the Google Font dynamically
    const fontFamily = font.replace(/ /g, "+");
    const linkId = "dynamic-global-font";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = `${GOOGLE_FONTS_BASE}${fontFamily}:wght@300;400;500;600;700;800&display=swap`;

    // Apply the font globally
    document.documentElement.style.setProperty("--font-sans", `"${font}", sans-serif`);
    document.documentElement.style.setProperty("--font-heading", `"${font}", sans-serif`);
  }, [font]);

  return <>{children}</>;
};

export default GlobalFontProvider;
