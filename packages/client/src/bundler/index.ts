import * as esbuild from 'esbuild-wasm';
import { fetchPlugin } from './plugins/fetch-plugin';
import { unpkgPathPlugin } from './plugins/unpkg-path.plugin';

let service: esbuild.Service;
const bundlerHandler = async (rawCode: string) => {
  // Start up the service if it has not yet
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }

  // Bundle the raw code
  try {
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      // Replace process.env.NODE_ENV to 'production', and global to window in the bundle
      define: { 'process.env.NODE_ENV': '"production"', global: 'window' },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment',
    });
    return { code: result.outputFiles[0].text, error: '' };
  } catch (error) {
    return { code: '', error: error.message };
  }
};

export default bundlerHandler;
