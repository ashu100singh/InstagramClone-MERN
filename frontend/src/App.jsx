import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import MainLayout from './components/MainLayout'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'


const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout/>,
		children: [
			{
				path: '/',
				element: <Home/>
			},
			{
				path: '/profile',
				element: <Profile/>
			},

		]
	},
	{
		path: '/login',
		element: <Login/>
	},
	{
		path: '/signup',
		element: <Signup/>
	}
])

const App = () => {
  return (
    <>
		<RouterProvider router={browserRouter} />
    </>
  )
}

export default App