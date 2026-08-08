import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

// ⚠️ Fixed: Capital 'L' aur '.jsx' extension add kar diya hai
import Login from './Auth/Login.jsx'
import Register from './Auth/Register.jsx'
import Main from './Page/Main.jsx'
import Desktop from './Page/Desktop.jsx'
import Profile from './Page/Profile.jsx'

import IsGuest from './utils/IsGuest.jsx'
import IsAuth from './utils/IsAuth.jsx'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <IsGuest><Login /></IsGuest>
  },
  {
    path: "/register",
    element: <IsGuest><Register /></IsGuest>
  },
  {
    path: "/",
    element: (
      <IsAuth>
        <Main />
      </IsAuth>
    ),
    children: [
      {
        path: '/',
        element: <Desktop />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  }
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App