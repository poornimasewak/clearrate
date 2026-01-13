/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude Firecrawl and undici from webpack bundling
    config.externals = config.externals || [];
    config.externals.push({
      'undici': 'commonjs undici',
      '@mendable/firecrawl-js': 'commonjs @mendable/firecrawl-js',
    });
    return config;
  },
  experimental: {
    // Ensure these packages run in Node.js environment
    serverComponentsExternalPackages: ['@mendable/firecrawl-js', 'undici'],
  },
};

export default nextConfig;

