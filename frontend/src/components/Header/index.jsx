import React from 'react'
import { Outlet } from 'react-router-dom'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';


const Header = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='sticky'>
        <Toolbar>
          <Box>
            <img src="/logo.png" alt="logo" height={50} width={50}/>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Outlet />
    </Box>
  )
}

export default Header
