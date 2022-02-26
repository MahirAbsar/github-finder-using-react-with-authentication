import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
} from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAuth0()
  return isAuthenticated && user ? <Outlet /> : <Navigate to='/login' />
}
export default PrivateRoute
