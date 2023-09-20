import React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)

  let RoomCode = useParams()

  const getRoomDetails = async () => {
    const room = await axios.get(`http://127.0.0.1:8000/api/get-room?code=${RoomCode.code}`)
    console.log(room)
  }

  getRoomDetails()

  return (
    <div>
      <h1>code: {RoomCode.code}</h1>
      <p>Votes: {votesToSkip}</p>
      <p>Guest can pause: {guestCanPause}</p>
      <p>Host: {isHost}</p>
    </div>
  )
}

export default Room
