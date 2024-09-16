import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  minify: true,
  bundle: false,
  clean: true,
  format: "esm",
  sourcemap: true,
  silent: true,
});
