// next-seo.config.js
const nextSeoConfig = {
  title: 'Sanket Joshi · Founding Technical Lead & Frontend Tech Lead',
  description: 'Frontend tech lead with 10+ years building teams and shipping React, TypeScript and Node.js products.',
  openGraph: {
    url: "https://www.techsanket.in/",
    title: "Home | Sanket Joshi",
    description:
      "Home Page of Sanket Joshi, showcasing expertise in React, Node.js, AWS, and software development.",
    images: [
      {
        url: "https://www.techsanket.in/sj-og-image.jpg",
        width: 800,
        height: 600,
        alt: "TechSanket Portfolio OG Image",
      },
      {
        url: "https://www.techsanket.in/sj-og-image.jpg",
        width: 1200,
        height: 627,
        alt: "TechSanket Portfolio OG Image",
      },
    ],
    site_name: "TechSanket Portfolio",
  },
  additionalMetaTags:
    [
      {
        property: "keywords",
        content: "Full-Stack Developer, React, Node.js, AWS, Portfolio",
      },
    ],
  twitter: {
    handle: '@sanket84808866',
    site: '@techsanket',
    cardType: 'summary_large_image',
  },
};

export default nextSeoConfig;