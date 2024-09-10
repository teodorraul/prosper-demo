import React from "react";
import { createRoot } from "react-dom/client";

import "supabase/index";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";
import { RouteAgents } from "./routes/agents";
import { AnotherPage } from "./routes/another-page";
import { IndexRoutesContainer } from "./routes";

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IndexRoutesContainer />,
		children: [
			{
				path: "/agents",
				element: <RouteAgents />,
			},
			{
				path: "/another-page",
				element: <AnotherPage />,
			},
		],
	},
]);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
