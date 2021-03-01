import axios from 'axios';
import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // This runs everytime ESbuild is looking for a module, to find the path (file system location)
      // We can modify it and feed it an unpkg route to fetch npm modules
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        // intercept import paths and redirect to unpkg url
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // if the file have relative path imports, we make use of the URL constructor to intelligently join the relative path and the root path together
        // This handles both imports with relative paths and nested paths
        if (args.path.includes('./') || args.path.includes('../')) {
          const url = new URL(
            args.path,
            'https://unpkg.com' + args.resolveDir + '/',
          ).href;
          return {
            path: url,
            namespace: 'a',
          };
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a',
        };
      });

      // Load the content of the module with the specified paths
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import React from 'react';
              console.log(message);
            `,
          };
        } else {
          const { data, request } = await axios.get(args.path);
          return {
            loader: 'jsx',
            contents: data,
            // Where we found our last package, to resolve nested paths
            resolveDir: new URL('./', request.responseURL).pathname,
          };
        }
      });
    },
  };
};
