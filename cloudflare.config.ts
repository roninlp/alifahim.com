import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "site",
		compatibilityDate: "2026-10-06",
		domains: ["alifahim.com"],
		observability: {
			enabled: true,
		},
	},
});
