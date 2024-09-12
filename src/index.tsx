import './supabase/index';

import { Provider } from 'mobx-react';
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import { LoadingScreen } from './components/loadingScreen';
import { IndexRoutesContainer } from './routes';
import { RouteAgents } from './routes/agents';
import { AnotherPage } from './routes/another-page';
import Store from './store/root.store';

const rootElement = document.querySelector("#root");
if (!rootElement) throw new Error("Failed to find the root element");

const AgentsIdRoute = lazy(() => import("./routes/agents.id"));
const root = createRoot(rootElement);

const router = createBrowserRouter([
	{
		path: "/",
		element: <IndexRoutesContainer />,
		children: [
			{
				path: "/",
				element: <Navigate to="/agents" />,
			},
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
	{
		path: "/agents/:id",
		//teo
		element: (
			<Suspense fallback={<LoadingScreen />}>
				<AgentsIdRoute />
			</Suspense>
		),
	},
]);

document.fonts.load('1em "Your Web Font"').then(function () {
	Store.setFontsReady();
});

root.render(
	<React.StrictMode>
		<Provider value={Store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);
