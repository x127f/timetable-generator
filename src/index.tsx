import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import LocalStorageBackend from "i18next-localstorage-backend"; // primary use cache
import HttpApi from "i18next-http-backend";
import Backend from "i18next-chained-backend";

// @ts-ignore
i18n.use(LanguageDetector)
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(Backend)
	.init({
		backend: {
			backends: [
				LocalStorageBackend, // primary backend
				HttpApi, // fallback backend
			],
			backendOptions: [
				{
					/* options for primary backend */
				},
				{
					/* options for secondary backend */
					loadPath: "/locales/{{lng}}/{{ns}}.json", // http load path for my own fallback
				},
			],
		},
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

ReactDOM.render(
	<React.StrictMode>
		<App></App>
	</React.StrictMode>,
	document.getElementById("root")
);

reportWebVitals(console.log);
