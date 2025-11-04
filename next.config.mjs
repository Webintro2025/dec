/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Avoid failing the Vercel build due to dev-only ESLint parsers (eg. TypeScript parser)
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
