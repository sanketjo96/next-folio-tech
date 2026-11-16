// next-seo.config.js — site-wide defaults; pages override title/description/canonical.
const SITE_URL = "https://www.techsanket.in";
const TITLE = "Sanket Joshi | Senior Software Engineer | React, Node.js & AI";
const DESCRIPTION =
  "Sanket Joshi is a software engineer with 12+ years building modern web applications with React, TypeScript, Next.js and Node.js, and exploring Generative AI.";

const nextSeoConfig = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        // Made from public/sanket-portrait.jpg; 1200x630 is the size every
        // link-preview card (WhatsApp, LinkedIn, X, Slack) expects.
        url: `${SITE_URL}/og-tech.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Sanket Joshi, Senior Software Engineer: React, TypeScript, Next.js, Node.js and Generative AI",
      },
    ],
    site_name: "Sanket Joshi",
  },
  additionalMetaTags: [
    { name: "author", content: "Sanket Joshi" },
    {
      name: "keywords",
      content:
        "Sanket Joshi, software engineer, senior software engineer, frontend architecture, React, TypeScript, Next.js, Node.js, Generative AI, Pune, Marathi stand-up comedian",
    },
  ],
  additionalLinkTags: [
    { rel: "alternate", type: "text/plain", href: `${SITE_URL}/llms.txt`, title: "LLM-readable site summary" },
  ],
  twitter: {
    handle: "@sanket84808866",
    site: "@techsanket",
    cardType: "summary_large_image",
  },
};

export default nextSeoConfig;
