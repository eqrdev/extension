import { dirname, join } from "path";
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials")],
  typescript: {
    reactDocgen: 'react-docgen-typescript'
  },
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {}
  },
  docs: {
    autodocs: true
  }
};
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}