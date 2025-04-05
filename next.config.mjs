import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
