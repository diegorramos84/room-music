/* eslint-disable react/prop-types */
import React from 'react'
import { Grid, Typography, Card, IconButton, LinearProgress, Box } from '@mui/material'
// import {PlayArrow, SkipNext, Pause} from '@mui/icons-material'
import axios from 'axios'


const MusicPlayer = (props) => {
  const songProgress = (props.time / props.duration) * 100

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

    } catch (error) {
      console.log(error)
    }
  }


  return (
      <Card>
        <Grid container alignItems="center" spacing={2}>
          <Grid item align="center" xs={12}>
            <Box component="img"
              src={props.image_url}
              alt="cover"
              sx={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography component='h6' variant='h6'>
              {props.title}
            </Typography>
            <Typography color="textSecondary" variant='overline'>
              {props.artist}
            </Typography>
            <Box>
              <Box>
                { props.is_playing ?
                <Typography variant='body1' component='div' onClick={pauseSong} sx={{
                  cursor: 'pointer',
                  color: '#1AC183',
                  transition: 'all 0.3s',
                  '&:hover': {
                    color: 'blue',
                    backgroundColor: '#1AC183',
                    opacity: 0.8,
                  }
                }}>[Pause]</Typography>
                : <Typography onClick={playSong} sx={{
                  cursor: 'pointer',
                  color: '#1AC183',
                  transition: 'all 0.3s',
                  '&:hover': {
                    color: 'blue',
                    backgroundColor: '#1AC183',
                    opacity: 0.8,
                  }
                }}>[Play]</Typography>}
              </Box>
              <IconButton>
                <Typography onClick={skipSong} sx={{ cursor: 'pointer'}}>[Skip]</Typography>
                {/* <SkipNext onClick={skipSong}/> */}
              </IconButton>
              <Typography color="textSecondary" variant='subtitle1'>
                Votes to skip: {props.votes} / {props.votes_required}
              </Typography>
            </Box>
          </Grid>
        </Grid>
          <LinearProgress variant='determinate' value={songProgress} />
      </Card>
  )
}

export default MusicPlayer
