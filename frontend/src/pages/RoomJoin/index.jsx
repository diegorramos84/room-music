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
        <Typography padding={2} color='#1AC183' variant='h4' component="h4">
          join a room:
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
          sx = {{
            '& label.Mui-focused': {
              color: '#1AC183',
            },
            '& .MuiInput-underline:after': {
              borderBottomColor: '#18b6ff', // Change underline color when focused
            },
            '& input': {
              color: '#18b6ff'
            }
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          size='small'
          variant='text'
          onClick={handleSubmit}
          sx={{
            cursor: 'pointer',
            color: '#18b6ff',
            fontSize:'1.8vh',
            textTransform: 'none',
            padding:0,
            ":hover": {
              color: 'black',
              backgroundColor: '#18b6ff',
              boxShadow: '0.4ch 0 0 0 #18b6ff, -0.3ch 0 0 0 #18b6ff, 0.4ch 0.2ch 0 0 #18b6ff, -0.3ch 0.2ch 0 0 #18b6ff',
              opacity: 0.8,
            }
          }}
          >[join Room]
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          to="/"
          component={Link}
          size='small'
          variant='text'
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
            }
          }}
        >[back]</Button>
      </Grid>
    </Grid>
  )
}

export default RoomJoin
