/* eslint-disable no-unused-vars */
import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import * as Pages from './pages'
import * as Components from './components'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Components.Header />}>
      <Route index element={<Pages.Home />}/>
      <Route path='/join' element={<Pages.RoomJoin />}/>
      <Route path='/create' element={<Pages.RoomCreate />}/>
    </Route>
  )
)

function App() {

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router}/>
      </ThemeProvider>
    </>
  )
}

export default App
