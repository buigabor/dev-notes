import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // This runs everytime ESbuild is looking for a module, to find the path (file system location)
      // We can modify it and feed it an unpkg route to fetch npm modules

      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /^index\.js$/ }, async (args: any) => {
        return { path: args.path, namespace: 'a' };
      });

      // Handle relative and nested routes in a module
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        const url = new URL(
          args.path,
          'https://unpkg.com' + args.resolveDir + '/',
        ).href;
        return {
          path: url,
          namespace: 'a',
        };
      });

      // intercept import paths and redirect to unpkg url
      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a',
        };
      });
    },
  };
};
