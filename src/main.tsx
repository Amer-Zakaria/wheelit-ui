import React from "react";
import * as ReactDom from "react-dom/client";
import App from "./App.tsx";
import "./main.css";

const root: HTMLElement | null = document.getElementById("root");

if (root) {
	ReactDom.createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}
