import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Room = () => {
  const [votesToSkip, setVotesToSkip] = useState(2)
  const [guestCanPause, setGuestCanPause] = useState(false)
  const [isHost, setIsHost] = useState(false)

  let RoomCode = useParams()

  const getRoomDetails = async () => {
    const roomData = await axios.get(`http://127.0.0.1:8000/api/get-room?code=${RoomCode.code}`)
    setVotesToSkip(roomData.data.votes_to_skip)
    setIsHost(String(roomData.data.is_host))
    setGuestCanPause(String(roomData.data.guest_can_pause))
    console.log(roomData.data)
  }

  useEffect(() => {
    try {
      getRoomDetails()
    } catch (error) {
      console.log(error)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
