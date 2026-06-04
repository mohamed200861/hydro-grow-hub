// Fallback shim for TanStack Start's virtual manifest module when the
// Cloudflare bundler cannot resolve `tanstack-start-manifest:v`.
export const tsrStartManifest = () => ({ routes: {} });
export default tsrStartManifest;
