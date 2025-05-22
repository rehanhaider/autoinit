import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import * as config from "../config.json";

import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: `https://${config.DOMAIN_NAME}`,
    output: "static",
    integrations: [tailwind(), react(), mdx(), sitemap()],
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },
    env: {
        schema: {
            PUBLIC_CDK_AWS_REGION: envField.string({ context: "client", access: "public" }),
            PUBLIC_USER_POOL_ID: envField.string({ context: "client", access: "public" }),
            PUBLIC_APP_CLIENT_ID: envField.string({ context: "client", access: "public" }),
            PUBLIC_BUCKET_NAME: envField.string({ context: "client", access: "public" }),
            PUBLIC_RECAPATCHA_CLIENT_KEY: envField.string({ context: "client", access: "public" }),
            PUBLIC_GOOGLE_ANALYTICS_ID: envField.string({ context: "client", access: "public" }),
        },
    },
    experimental: {
        svg: true,
        clientPrerender: true,
    },
    server: {
        port: 3000,
    },
});
