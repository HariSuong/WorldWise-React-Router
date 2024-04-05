/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from 'react'
const URL_BASE = 'http://localhost:9000'

const CitiesContext = createContext()

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState({})

  useEffect(() => {
    setIsLoading(true)

    const fetchData = async () => {
      try {
        const res = await fetch(`${URL_BASE}/cities`)
        const data = await res.json()

        setCities(data)
      } catch (error) {
        alert(`Something went wrong ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getCity = async id => {
    setIsLoading(true)
    try {
      const res = await fetch(`${URL_BASE}/cities/?id=${id}`)

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const data = await res.json()

      setCurrentCity(data[0])
    } catch (error) {
      alert(`Something went wrong ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const createCity = async newCity => {
    setIsLoading(true)
    try {
      const res = await fetch(`${URL_BASE}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      const data = await res.json()
      setCities(cities => [...cities, data])
    } catch (error) {
      alert(`Something went wrong ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCity = async id => {
    setIsLoading(true)
    try {
      const res = await fetch(`${URL_BASE}/cities/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`)
      }

      setCities(cities => cities.filter(city => city.id !== id))
    } catch (error) {
      alert(`Something went wrong ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const store = {
    cities,
    isLoading,
    getCity,
    currentCity,
    createCity,
    deleteCity
  }

  return (
    <CitiesContext.Provider value={store}>{children}</CitiesContext.Provider>
  )
}

const useCities = () => {
  const context = useContext(CitiesContext)
  return context
}

export { CitiesProvider, useCities }
