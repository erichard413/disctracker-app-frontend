import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()
//   ],
// })

import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
      "process.env": env,
    },
    plugins: [react()],
    test: {
      //this is personal preference, this will auto import all of things from testing library. setting this to false will require individually importing them.
      //global: true
      environment: "jsdom",
      setupFiles: "./test-setup/setupTests.js",
    },
  };
});
