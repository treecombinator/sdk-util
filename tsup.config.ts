import { defineConfig } from "tsup";

// sdk-util: a single entry of pure helpers. No runtime dependencies.
// Portable dual ESM + CJS + type declarations.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
});
