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
        console.log('onResolve', args);
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a',
        };
      });

      // build.onLoad({ filter: /.*/ }, async (args: any) => {
      //   console.log('onLoad', args);

      //   if (args.path === 'index.js') {
      //     return {
      //       loader: 'jsx',
      //       contents: inputCode,
      //     };
      //   } else {
      //     // Check to see if we have fetched this file and if it is in the cache
      //     const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
      //       args.path,
      //     );
      //     // if yes, return it

      //     if (cachedResult) {
      //       return cachedResult;
      //     }
      //     // if no, fetch it
      //     const { data, request } = await axios.get(args.path);

      //     const loader = args.path.match(/.css$/) ? 'css' : 'jsx';
      //     const result: esbuild.OnLoadResult = {
      //       loader: loader,
      //       contents: data,
      //       // Where we found our last package, to resolve nested paths
      //       resolveDir: new URL('./', request.responseURL).pathname,
      //     };

      //     await fileCache.setItem(args.path, result);

      //     // store response in cache
      //     return result;
      //   }
      // });
    },
  };
};
