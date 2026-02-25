/** @type {import('next').NextConfig} */
const repo = "oozly2";

module.exports = {
  output: "export",
  images: { unoptimized: true },
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
};
