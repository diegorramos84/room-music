import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import { useState } from 'react'
import axios from 'axios'


const RoomCreate = () => {
  const [guestCanPause, setGuestCanPause] = useState(true)
  const [votesToSkip, setvotesToSkip] = useState(2)

  const handleVotesSkip = (e) => {
    setvotesToSkip(e.target.value)
  }

  const handleGuestCanPauseChange = (e) => {
    e.target.value === 'true' ? setGuestCanPause(true) : setGuestCanPause(false)
  }

  const handleSubmit = async () => {

    const options = {
      headers: {'Content-Type': 'application/json'},
      body: {
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause
      }
    }

    try {
      const roomCreated = await axios.post('http://127.0.0.1:8000/api/create-room', options)
      console.log('Room created', roomCreated)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(votesToSkip)
  console.log(guestCanPause)

  return (
    <Grid container spacing ={1}>
      <Grid item xs={12} align="center">
        <Typography component={'h4'} variant='h4'>
          Create a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <FormHelperText component={'span'}>
            <Box textAlign='center'>Guest control of playback:</Box>
          </FormHelperText>
          <RadioGroup row defaultValue="true">
            <FormControlLabel
              label='Play/Pause'
              value='true'
              labelPlacement='bottom'
              onChange={handleGuestCanPauseChange}
              control={<Radio />}/>
            <FormControlLabel
              label='No Control'
              value='false'
              onChange={handleGuestCanPauseChange}
              labelPlacement='bottom'
              control={<Radio color='error' />}/>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type='number'
            defaultValue={votesToSkip}
            onChange={handleVotesSkip}
            size='small'
            inputProps={{
              min: 1,
              style: { textAlign: 'center'}
            }}
          />
          <FormHelperText component={'span'}>
            <Box textAlign='center'>Votes required to skip song</Box>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12} align="center">
        <Button
          color='primary'
          variant='contained'
          onClick={handleSubmit}
          >Create a room
        </Button>
      </Grid>
      <Grid item xs={12} align="center">
        <Button color='secondary' variant='contained' to="/" component={Link}>Back</Button>
      </Grid>
    </Grid>
  )
}

export default RoomCreate
