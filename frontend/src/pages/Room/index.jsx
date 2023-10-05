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

    const interval = setInterval(getCurrentSong,3000)

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
    if (spotifyAuth === false) {
      console.log('User is not authenticated, redirecting to Spotify...')
      authenticateSpotify()
    }
    if (spotifyAuth === true) {
      console.log('User is alread logged in at Spotify')
    }
  }, [spotifyAuth])


  const renderSettings = () => {
    return (
    <Grid container align="center" direction="column" alignItems="center" justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <RoomCreate update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} getRoomDetails={getRoomDetails}/>
      </Grid>
      <Grid item xs={12}>
        <Button
          size='small'
          variant='text'
          onClick={() => handleShowSettings(false)}
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
        >[close settings]</Button>
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
    <Grid container align="center" alignItems="center" justifyContent="center" spacing={2}>
      <Grid item xs={12}>
        <Typography padding={1} color='#1AC183' variant='h6' component="h6">
          <span style={{ color: isHost === 'true' ? '#A66522' : '#B6B622'}}>
            {isHost === 'true' ? '[host] ' : '[guest] '}
          </span>room code: {roomCode.code}
        </Typography>
        {/* <Typography padding={0} color='#1AC183' variant='h6' component="h6" >
          {isHost ? "Host" : 'Guest'}
        </Typography> */}
      </Grid>
      <Grid item xs={12}>
        <MusicPlayer {...song} isHost={isHost}/>
      </Grid>
      { isHost === 'true'
        ? <Grid item xs={12}>
            <Button
              size='small'
              variant='text'
              onClick={() => handleShowSettings(true)}
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
            >[settings]</Button>
          </Grid>
        : null
      }
      <Grid item xs={6}>
        <Button
          size='small'
          variant='text'
          onClick={leaveRoom}
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
        >[leave room]</Button>
      </Grid>
    </Grid>
  )
}

export default Room
