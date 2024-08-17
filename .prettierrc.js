import vercelPrettierOptions from '@vercel/style-guide/prettier';

/** @type {import('prettier').Config} */
const config = {
  ...vercelPrettierOptions,
  tabWidth: 2,
  singleQuote: false,
  jsxSingleQuote: false,
  plugins: [...vercelPrettierOptions.plugins, 'prettier-plugin-prisma'],
};

export default config;
