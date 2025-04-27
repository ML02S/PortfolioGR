import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // Statische export-instellingen
  trailingSlash: true,  // Zorg ervoor dat de URLs eindigen op /index.html
  output: 'export',     // Dit zorgt ervoor dat de site wordt geëxporteerd als statische bestanden
  images: {
    unoptimized: true,  // Disable image optimization for static export
  },
};

const withMDX = createMDX({
  // Voeg hier eventueel MDX-plugins toe
});

// Combineer de MDX-configuratie met de Next.js-configuratie
export default withMDX(nextConfig);
