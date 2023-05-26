import type { Options } from "tsup";

export const defaultOptions: Options = {
  target: "node18",
  entry: ["src/index.ts"],
  minify: true,
  outDir: "dist",
  dts: true,
  splitting: true,
  sourcemap: true,
  format: ["esm", "cjs"],
};

export default defaultOptions;
