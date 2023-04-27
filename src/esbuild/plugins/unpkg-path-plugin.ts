import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root file in code
      build.onResolve({ filter: /(^index\.js$)/}, (args: any) => {
        return {path: args.path, namespace: 'a'}
      });

      // Handle nested files inside the package
      build.onResolve({ filter: /^\.+\//}, (args: any) => {
        return {
          namespace: 'b',
          path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href
        }
      });

      // Handle main file inside the package
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return { 
          path: `https://unpkg.com/${args.path}`, 
          namespace: 'a' 
        };
        
      });
    },
  };
};