/**
 * Centralized site configuration
 * All brand-related settings are pulled from environment variables
 * to make the template fully configurable without code changes.
 */

export const siteConfig = {
    // Brand names
    name: process.env.NEXT_PUBLIC_SITE_NAME || "Tesla Inc",
    brandPrimary: process.env.NEXT_PUBLIC_BRAND_PRIMARY || "Tesla",
    brandAccent: process.env.NEXT_PUBLIC_BRAND_ACCENT || "Inc",
    
    // SEO & Marketing
    tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Invest in the Future",
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Gain exposure to Tesla, SpaceX, Neuralink, xAI, and The Boring Company — the companies shaping humanity's next chapter.",
    
    // URLs
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    
    // Email branding (for templates)
    emailFromName: process.env.SMTP_FROM_NAME || "Tesla Inc",
} as const;

// For use in metadata and server components
export const getSiteConfig = () => siteConfig;

// Type export for TypeScript
export type SiteConfig = typeof siteConfig;
