/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Box } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true;



const RoomCreate = (props) => {
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause)
  const [votesToSkip, setvotesToSkip] = useState(props.votesToSkip)
  const [updateMode, setUpdateMode] = useState(props.update)

  const navigate = useNavigate()

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
        guest_can_pause: guestCanPause,
        code: props.roomCode.code
      },
      withCredentials: true
    }

    try {
      if (updateMode === true) {
        await axios.patch('http://127.0.0.1:8000/api/update-room', options)
        window.alert('Room updated')
        props.getRoomDetails()
      }
      const roomCreated = await axios.post('http://127.0.0.1:8000/api/create-room', options)
      navigate(`/room/${roomCreated.data.code}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center" >
      <Grid item xs={12}>
        <Typography component={'h4'} variant='h4'>
          { updateMode === true ? 'Update Room' : 'Create a Room' }
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <Button
          color='primary'
          variant='contained'
          onClick={handleSubmit}
          >{ updateMode === true ? 'Update Room' : 'Create a Room' }
        </Button>
      </Grid>
      { updateMode === true
        ? null
        : <Grid item xs={12}>
            <Button color='secondary' variant='contained' to="/" component={Link}>Back</Button>
          </Grid>
      }

    </Grid>
  )
}

RoomCreate.defaultProps = {
  votesToSkip: 2,
  guestCanPause: false,
  update: false,
  roomCode: null,
  updateCallback: () => {}
}

export default RoomCreate
