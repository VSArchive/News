import GlobalPolyFill from "@esbuild-plugins/node-globals-polyfill"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		esbuildOptions: {
			define: {
				global: "globalThis",
			},
			plugins: [
				GlobalPolyFill({
					process: true,
					buffer: true,
				}),
			],
		},
	},
	resolve: {
		alias: {
			process: "process/browser",
			stream: "stream-browserify",
			zlib: "browserify-zlib",
			util: "util",
		},
	},
})