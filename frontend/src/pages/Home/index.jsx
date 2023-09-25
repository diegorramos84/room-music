/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Grid, Button, ButtonGroup, Typography } from '@mui/material'
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
        <Typography variant='h3' compact="h3">
          Our Party!
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup variant='contained'>
          <Button color="primary" to="/join" component={ Link }>Join a room</Button>
          <Button color="secondary" to="/create" component={ Link }>Create a room</Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  )
}

export default Home
