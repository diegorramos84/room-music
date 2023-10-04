/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Box, Collapse, Alert } from '@mui/material'
import { useState } from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true;



const RoomCreate = (props) => {
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause)
  const [votesToSkip, setvotesToSkip] = useState(props.votesToSkip)
  const [updateMode, setUpdateMode] = useState(props.update)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const navigate = useNavigate()

  const handleVotesSkip = (e) => {
    setvotesToSkip(e.target.value)
  }

  const handleGuestCanPauseTrue = () => {
    setGuestCanPause(true)
  }

  const handleGuestCanPauseFalse = () => {
    setGuestCanPause(false)
  }

  const handleCreate= async () => {
    console.log(guestCanPause, "GUEST")
    const options = {
      headers: {'Content-Type': 'application/json'},
      body: {
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      },
      withCredentials: true
    }

    console.log(options,'guestCanPause')
    try {
      const roomCreated = await axios.post('http://127.0.0.1:8000/api/create-room', options)
      navigate(`/room/${roomCreated.data.code}`)

    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async () => {

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
        await axios.patch('http://127.0.0.1:8000/api/update-room', options)
        setSuccessMsg('Room settings updated!')
        props.getRoomDetails()
    } catch (error) {
      setErrorMsg('Error updating Room settings')
      console.log(error)
    }
  }

  return (
    <Grid container direction="column" spacing={1} alignItems="center" justifyContent="center" >
      <Grid item xs={12}>
        <Collapse in={ errorMsg != "" || successMsg != "" }>
          {successMsg != ""
            ? <Alert severity='success' onClose={() => setSuccessMsg("")}>{successMsg}</Alert>
            : null
          }
          {errorMsg != ""
            ? <Alert severity='error' onClose={() => setErrorMsg("")}>{errorMsg}</Alert>
            : null
          }
        </Collapse>
      </Grid>
      <Grid item xs={12}>
        <Typography component={'h4'} variant='h4' padding={2} color='#1AC183'>
          { updateMode === true ? 'update room' : 'create a room' }
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ marginBottom: '10px'}}>
          <FormHelperText component={'span'}>
            <Box textAlign='center'>Guest control of playback:</Box>
          </FormHelperText>
          <RadioGroup row defaultValue="true">
            <FormControlLabel
              label='[play/pause]'
              value='true'
              labelPlacement='bottom'
              onChange={handleGuestCanPauseTrue}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: '#18b6ff'
                }
              }}
              control={<Radio sx={{color:'#18b6ff'}} />}/>
            <FormControlLabel
              label='[no control]'
              value='false'
              onChange={handleGuestCanPauseFalse}
              labelPlacement='bottom'
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: '#ff45b4'
                }
              }}
              control={<Radio sx={{color: '#ff45b4'}} />}/>
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ marginBottom: '10px'}}>
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
            sx = {{
              '& .MuiInput-underline:after': {
                borderBottomColor: '#18b6ff', // Change underline color when focused
              },
              '& input': {
                color: '#18b6ff'
              }
            }}
          />
          <FormHelperText component={'span'}>
            <Box textAlign='center' color={'#1AC183'}>Votes required to skip song</Box>
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button
          size='small'
          variant='text'
          onClick={ updateMode === true ? handleUpdate : handleCreate }
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
          }}}
          >{ updateMode === true ? '[update room]' : '[create a room]' }
        </Button>
      </Grid>
      { updateMode === true
        ? null
        : <Grid item xs={12}>
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
      }

    </Grid>
  )
}

RoomCreate.defaultProps = {
  votesToSkip: 2,
  guestCanPause: true,
  update: false,
  roomCode: null,
  updateCallback: () => {}
}

export default RoomCreate
