import React from 'react'
import { TextField, Button, Grid, Typography } from '@mui/material'
import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import axios from 'axios'



const RoomJoin = () => {
  const [roomCode, setRoomCode] = useState("")
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const options = {
      headers: {'Content-Type': 'application/json'},
      body: {
        code: roomCode
      },
      withCredentials: true
    }
    try {
      await axios.post(`http://127.0.0.1:8000/api/join-room`, options)
      navigate(`/room/${roomCode}`)
    } catch (error) {
      if (error.response) {
        setError(true)
        setErrorMessage('Error joining room. Please check the code')
      }
      console.log(error)
    }
  }

  const handleTextChange = (e) => {
    setError(false)
    setErrorMessage("")
    setRoomCode(e.target.value)
  }

  return (
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography variant='h4' component='h4'>
          Join a Room:
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          error={!roomCode ? false : error }
          label="Code"
          placeholder='Enter a Room Code'
          value={roomCode}
          helperText={!roomCode ? "" : errorMessage}
          variant='outlined'
          onChange={handleTextChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          color='primary'
          variant='contained'
          onClick={handleSubmit}
          >Join Room
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography color='secondary' variant='contained' to="/" component={Link}>Back</Typography>
      </Grid>
    </Grid>
  )
}

export default RoomJoin
