import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./conway.css";

import App from "./App";

const root = createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<App rows={24} cols={32} />
	</StrictMode>
);
