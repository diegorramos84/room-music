/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Grid, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import RoomCreate from '../RoomCreate'
import { MusicPlayer } from '../../components'

const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [spotifyAuth, setSpotifyAuth] = useState(null)
  const [song, setSong] = useState({})

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

  const getCurrentSong = async () => {
    try {
      const songData = await axios.get('http://127.0.0.1:8000/spotify/current-song')
      if (songData) {
        setSong(songData.data)
      }

    } catch (error) {
      console.log(error)
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

  const checkAuthenticateSpotify = async () => {
    console.log('Check')
    try {
      const data = await axios.get('http://127.0.0.1:8000/spotify/is-auth')

      const status = data.data.status

      // only updates the state if user is NOT auth to avoid infinite loop redirection
      if(status === false) {
        setSpotifyAuth(status)
      }
      if(status === true){
        console.log('User is already authenticated')
      }

    } catch (error) {
      console.log(error)
    }
  }

  const authenticateSpotify = async () => {
    console.log('auth')
    if(spotifyAuth === false) {
      try {
        const get_url = await axios.get('http://127.0.0.1:8000/spotify/get-url')
        const spotifyUrl = get_url.data.url
        window.location.href = spotifyUrl
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('user is already auth')
    }
  }


  // useEffect to get roomDetails when page is created and loaded
  useEffect(() => {
    getRoomDetails()

    const interval = setInterval(getCurrentSong,1000)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // should fire this after isHost is updated after getRoomDetails()
  useEffect(() => {
    if (isHost === 'true') {
      checkAuthenticateSpotify()
    }
  }, [isHost])

  // will be fired after we check if user is authenticated and update the auth state
  useEffect(() => {
    console.log(spotifyAuth)
    if (spotifyAuth === false) {
      console.log('User is not authenticated, redirecting to Spotify...')
      authenticateSpotify()
    }
    if (spotifyAuth === true) {
      console.log('User is alread logged in at Spotify')
    }
  }, [spotifyAuth])

  console.log(song.time)

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
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant='h4' component="h4">
          Code: {roomCode.code}
        </Typography>
      </Grid>
      <MusicPlayer {...song} />
      { isHost === 'true'
        ? <Grid item xs={6}>
            <Typography
              color= 'primary'
              variant='contained'
              onClick={() => handleShowSettings(true)}
              sx={{
                cursor: 'pointer'
              }}
            >[Settings]</Typography>
          </Grid>
        : null
      }
      <Grid item xs={6}>
        <Typography
          color='secondary'
          variant='contained'
          onClick={leaveRoom}
          sx={{
            cursor: 'pointer'
          }}
        >[Leave Room]</Typography>
      </Grid>
    </Grid>
  )
}

export default Room
