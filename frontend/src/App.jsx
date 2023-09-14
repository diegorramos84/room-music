/* eslint-disable no-unused-vars */
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import * as Pages from './pages'

function App() {

  return (
    <>
    <Routes>
      <Route>
        <Route index element={<Pages.Home />}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
