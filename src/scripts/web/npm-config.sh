#!/bin/bash


npm init -y
npm pkg set name=web version=0.1.0
npm pkg delete description main keywords author license type
npm pkg set scripts.dev='astro dev' scripts.start='astro dev' scripts.build='astro check && astro build'
npm pkg set scripts.preview='astro preview' scripts.astro='astro'
npm install --save astro @astrojs/react @astrojs/sitemap @astrojs/mdx
npm install --save react react-dom react-router-dom @types/react @types/react-dom
npm install --save @aws-sdk/client-cognito-identity-provider
npm install --save @tanstack/query-sync-storage-persister @tanstack/react-query @tanstack/react-query-persist-client
npm install --save nanostores @nanostores/persistent @nanostores/react
npm install --save axios marked tailwindcss @tailwindcss/vite typescript
npm install --save-dev daisyui prettier prettier-plugin-astro prettier-plugin-tailwindcss @tanstack/eslint-plugin-query