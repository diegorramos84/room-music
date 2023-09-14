import React from 'react'
import { Outlet, Link } from 'react-router-dom'

const Header = () => {


  return (
    <header>
    <nav>
      <Link to="/">Home</Link>
    </nav>
    <Outlet/>
  </header>
  )
}

export default Header
