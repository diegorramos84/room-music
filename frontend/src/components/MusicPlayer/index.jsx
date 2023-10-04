/* eslint-disable react/prop-types */
import React, { useState, useEffect} from 'react'
import { Grid, Typography, Card, LinearProgress, Box, Button } from '@mui/material'
import axios from 'axios'


const MusicPlayer = (props) => {
  const [voted, setVoted] = useState(false)
  const songProgress = (props.time / props.duration) * 100

  useEffect(() => {
    setVoted(false)
    console.log('triggered')
  }, [props.title])


  const pauseSong = async () => {
    const options = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }

    try {
      await axios.put('http://127.0.0.1:8000/spotify/pause-song', options)

    } catch (error) {
      console.log(error)
    }
  }

  const playSong = async () => {
    const options = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }

    try {
      await axios.put('http://127.0.0.1:8000/spotify/play-song', options)

    } catch (error) {
      console.log(error)
    }
  }

  const skipSong = async () => {
    const options = {
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    }

    try {
      await axios.post('http://127.0.0.1:8000/spotify/skip-song', options)
      if(props.isHost ==='false') {
        setVoted(true)
      } else {
        setVoted(false)
      }

    } catch (error) {
      console.log(error)
    }
  }


  return (
      <Card>
        <style>
        {`
          @keyframes scrolling {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
        </style>

        <Grid container alignItems="center" spacing={2}>
          <Grid item align="center" xs={12}>
            <Box component="img"
              src={props.image_url}
              alt="cover"
              sx={{
                width: '100%',
                maxWidth: '800px',
                maxHeight: '400px',
                objectFit: 'cover'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component='h6' variant='h6'sx={{
                cursor: 'progress',
                color: '#7E7E7E',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%',
                animation: 'scrolling 10s linear infinite',
                ':hover' : {
                  animationPlayState: 'paused',
                }
              }}>
              {props.title}
            </Typography>
            <Typography color="textSecondary" variant='overline'>
              {props.artist}
            </Typography>
            <Box>
              <Box paddingBottom={1}>
                { props.is_playing ?
                <Button size='small' variant='text' onClick={pauseSong} sx={{
                  cursor: 'pointer',
                  color: '#1AC183',
                  fontSize:'1.8vh',
                  textTransform: 'none',
                  padding:0,
                  marginRight: '10px',
                  ":hover": {
                    color: 'black',
                    backgroundColor: '#1AC183',
                    boxShadow: '0.4ch 0 0 0 #1AC183, -0.3ch 0 0 0 #1AC183, 0.4ch 0.2ch 0 0 #1AC183, -0.3ch 0.2ch 0 0 #1AC183',
                    opacity: 0.8,
                  }
                }}>[pause]</Button>
                : <Button size='small' variant='text' onClick={playSong} sx={{
                  cursor: 'pointer',
                  color: '#1AC183',
                  fontSize:'1.8vh',
                  textTransform: 'none',
                  padding:0,
                  marginRight: '10px',
                  ":hover": {
                    color: 'black',
                    backgroundColor: '#1AC183',
                    boxShadow: '0.4ch 0 0 0 #1AC183, -0.3ch 0 0 0 #1AC183, 0.4ch 0.2ch 0 0 #1AC183, -0.3ch 0.2ch 0 0 #1AC183',
                    opacity: 0.8,
                  }
                }}>[play]</Button>
              }
                <Button size='small' variant='text' onClick={skipSong} disabled={voted} sx={{
                  cursor: 'pointer',
                  color: '#b462ff',
                  fontSize:'1.8vh',
                  textTransform: 'none',
                  padding:0,
                  ":hover": {
                    color: 'black',
                    backgroundColor: '#b462ff',
                    boxShadow: '0.4ch 0 0 0 #b462ff, -0.3ch 0 0 0 #b462ff, 0.4ch 0.2ch 0 0 #b462ff, -0.3ch 0.2ch 0 0 #b462ff',
                    opacity: 0.8,
                  }
                }}>[skip]</Button>
              </Box>
              <Typography paddingBottom={1} color="#ff9528" variant='subtitle1'>
                Votes to skip: [ {props.votes} / {props.votes_required} ]
              </Typography>
            </Box>
          </Grid>
        </Grid>

          <LinearProgress
            variant='determinate'
            value={songProgress}
            style={{
              height: '10px',
            }}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1AC183'
              }
            }}
          />

      </Card>
  )
}

export default MusicPlayer
