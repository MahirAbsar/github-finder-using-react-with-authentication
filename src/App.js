import React from 'react'
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom'

function App() {
  return (
    <AuthWrapper>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path='/' element={<Dashboard />}></Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/*' element={<Error />} />
        </Routes>
      </Router>
    </AuthWrapper>
  )
}

export default App
