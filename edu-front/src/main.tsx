
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import Login from './pages/guest/Login.tsx';
import { RouterProvider } from 'react-router/dom';

const router = createBrowserRouter(
	[
		{
			path: '/login',
			element: <Login />
		}
	]
);

createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router} />
)
