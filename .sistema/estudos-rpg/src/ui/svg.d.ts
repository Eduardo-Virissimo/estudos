// O esbuild importa .svg como texto (loader "text" em esbuild.config.mjs).
declare module "*.svg" {
  const conteudo: string;
  export default conteudo;
}
