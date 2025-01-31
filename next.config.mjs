/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'metamob.fr',
                pathname: '/img/monstres/**',
            },
        ],
    },
};

export default nextConfig;
