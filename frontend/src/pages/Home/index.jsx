/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Grid, Button, ButtonGroup, Typography, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate()

  const userInRoom = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/user-in-room')
      //  protection when room is deleted
      if (res.data.code != null) {
        navigate(`/room/${res.data.code}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // check if user is in a room
    userInRoom()
  }, [])


  return (
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={3}>
      <Grid item xs={12}>
        {/* <Typography padding={2} color='#1AC183' variant='h4' component="h4">
          party time!
        </Typography> */}
      </Grid>
      <Box>
        <img src="/logo.png" alt="logo" />
      </Box>
      <Grid item xs={12}>
          <Button
            size='small'
            variant='text'
            to="/join"
            component={ Link }
            sx={{
              cursor: 'pointer',
              color: '#18b6ff',
              fontSize:'1.8vh',
              textTransform: 'none',
              padding:0,
              marginRight: '10px',
              ":hover": {
                color: 'black',
                backgroundColor: '#18b6ff',
                boxShadow: '0.4ch 0 0 0 #18b6ff, -0.3ch 0 0 0 #18b6ff, 0.4ch 0.2ch 0 0 #18b6ff, -0.3ch 0.2ch 0 0 #18b6ff',
                opacity: 0.8,
              }
            }}
          >[join a room]</Button>
          <Button
            size='small'
            variant='text'
            to="/create"
            component={ Link }
            sx={{
              cursor: 'pointer',
              color: '#ff45b4',
              fontSize:'1.8vh',
              textTransform: 'none',
              padding:0,
              ":hover": {
                color: 'black',
                backgroundColor: '#ff45b4',
                boxShadow: '0.4ch 0 0 0 #ff45b4, -0.3ch 0 0 0 #ff45b4, 0.4ch 0.2ch 0 0 #ff45b4, -0.3ch 0.2ch 0 0 #ff45b4',
                opacity: 0.8,
                borderRight: 'none !important'
              }
            }}
          >[create a room]</Button>
      </Grid>
    </Grid>
  )
}

export default Home
