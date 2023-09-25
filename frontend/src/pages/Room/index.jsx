/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Grid, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RoomCreate from '../RoomCreate'

const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const navigate = useNavigate()
  let roomCode = useParams()

  const getRoomDetails = async () => {
    try {
      const roomData = await axios.get(`http://127.0.0.1:8000/api/get-room?code=${roomCode.code}`)
      setVotesToSkip(roomData.data.votes_to_skip)
      setIsHost(String(roomData.data.is_host))
      setGuestCanPause(String(roomData.data.guest_can_pause))
      } catch (error) {
      navigate('/')
      console.log('You left the room or the room was deleted by the host!')
    }
  }

  const leaveRoom = async () => {
    const options = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/leave-room', options)
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    try {
      getRoomDetails()
    } catch (error) {
      console.log(error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderSettings = () => {
    return (
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <RoomCreate update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} getRoomDetails={getRoomDetails}/>
      </Grid>
      <Grid item xs={12}>
        <Button
          color='secondary'
          variant='contained'
          onClick={() => handleShowSettings(false)}
        >Close settings</Button>
      </Grid>
    </Grid>
    )
  }

  const handleShowSettings = (value) => {
    setShowSettings(value)
  }

  if (showSettings === true) {
    return  renderSettings()
  }
  return (
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <Typography variant='h4' component="h4">
          Code: {roomCode.code}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' component="h4">
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' component="h4">
          Guest can pause: {guestCanPause}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6' component="h4">
          Host: {isHost}
        </Typography>
      </Grid>
      { isHost === 'true'
        ? <Grid item xs={12}>
            <Button
              color= 'primary'
              variant='contained'
              onClick={() => handleShowSettings(true)}
            >Settings</Button>
          </Grid>
        : null
      }
      <Grid item xs={12}>
        <Button
          color='secondary'
          variant='contained'
          onClick={leaveRoom}
        >Leave Room</Button>
      </Grid>
    </Grid>
  )
}

export default Room