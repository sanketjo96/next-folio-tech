// next-seo.config.js
const nextSeoConfig = {
  title: 'Sanket Joshi | Frontend Developer with Nodejs and AWS',
  description: 'Portfolio of Sanket Joshi, showcasing expertise in React, Node.js, AWS, and software development.',
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