// tailwind config is required for editor support
import sharedConfig from "@repo/tailwind-config";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [sharedConfig],
};

export default config;
