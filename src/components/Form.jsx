// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { useURLPosition } from '../hooks/useURLPosition'
import styles from './Form.module.css'
import Button from './Button'
import ButtonBack from './ButtonBack'
import Message from './Message'
import Spinner from './Spinner'
import { useCities } from '../contexts/CitiesContext'
import { useNavigate } from 'react-router-dom'

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

function Form() {
  const { createCity, isLoading } = useCities()
  const navigate = useNavigate()

  const [lat, lng] = useURLPosition()
  const [isLoadingGeolocation, setIsLoadingGeolocation] = useState(false)
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [date, setDate] = useState(new Date())
  const [notes, setNotes] = useState('')
  const [geocodingError, setGeocodingError] = useState('')
  const [emoji, setEmoji] = useState('')

  useEffect(() => {
    const fetchCityDate = async () => {
      try {
        setIsLoadingGeolocation(true)
        if (!lat && !lng) return
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await res.json()

        if (!data.countryCode)
          throw new Error(
            "That's doesn't seem to be a city. Click somewhere else 😙"
          )

        setCityName(data.city || data.locality || '')
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode))
      } catch (error) {
        setGeocodingError(error.message)
      } finally {
        setIsLoadingGeolocation(false)
      }
    }

    fetchCityDate()
  }, [lat, lng])

  if (!lat && !lng)
    return <Message message='Start by clicking somewhere on the map' />

  if (geocodingError) return <Message message={geocodingError} />
  if (isLoadingGeolocation) return <Spinner />

  const submitHanler = async e => {
    e.preventDefault()

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng }
    }

    await createCity(newCity)
    navigate('/app')
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={submitHanler}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={e => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        {/* <input id='date' onChange={e => setDate(e.target.value)} value={date} /> */}
        <DatePicker
          id='date'
          onChange={date => setDate(date)}
          selected={date}
          dateFormat='dd/MM/yyyy'
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <ButtonBack />
      </div>
    </form>
  )
}

export default Form
