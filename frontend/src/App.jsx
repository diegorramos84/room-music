/* eslint-disable no-unused-vars */
import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import * as Pages from './pages'
import * as Components from './components'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Components.Header />}>
      <Route index element={<Pages.Home />}/>
    </Route>
  )
)

function App() {

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
