import {build} from 'vite';import path from 'node:path';import fs from 'node:fs/promises';
const root=path.resolve(import.meta.dirname,'..');
const offline={name:'offline-three',enforce:'pre',transform(code,id){
 if(id.endsWith('/loaders/FileLoader.js'))return `import {Loader} from './Loader.js';class FileLoader extends Loader {load(url,onLoad,onProgress,onError){if(onError)onError(new Error('Offline package: file loading is not used'));}setResponseType(v){this.responseType=v;return this;}}export {FileLoader};`;
 if(id.endsWith('/renderers/webxr/WebXRManager.js'))return `import {EventDispatcher} from '../../core/EventDispatcher.js';class WebXRManager extends EventDispatcher{constructor(){super();this.enabled=false;this.isPresenting=false;}dispose(){}setAnimationLoop(){}getSession(){return null;}getEnvironmentBlendMode(){return 'opaque';}hasDepthSensing(){return false;}}export {WebXRManager};`;
}};
await build({root,configFile:false,base:'./',plugins:[offline],resolve:{alias:{three:path.resolve(root,'../node_modules/three/src/Three.js')}},build:{target:['es2017','chrome61'],cssTarget:'chrome61',outDir:'dist',emptyOutDir:true,sourcemap:false,lib:{entry:path.join(root,'src/main.tsx'),name:'TIN',formats:['iife'],fileName:()=> 'app.js',cssFileName:'style'},rollupOptions:{output:{inlineDynamicImports:true}},minify:'esbuild'},define:{'process.env.NODE_ENV':'"production"'}});
const html='<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>TIN · 口袋里的小世界</title><link rel="stylesheet" href="./style.css"></head><body><div id="root"></div><script src="./app.js"></script></body></html>';
await fs.writeFile(path.join(root,'dist/index.html'),html);
console.log('Offline classic-script build ready');
