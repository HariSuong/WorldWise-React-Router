/* eslint-disable react/prop-types */
import Spinner from '../components/Spinner'
import CountryItem from './CountryItem'
import styles from './CountryList.module.css'
import Message from './Message'

const CountryList = ({ cities, isLoading }) => {
  if (isLoading && cities.length) return <Spinner />
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    )
  const countries = cities.reduce((arr, city) => {
    if (!arr.map(el => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }]
    else return arr
  }, [])
  return (
    <ul className={styles.countryList}>
      {countries.map(country => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  )
}

export default CountryList
