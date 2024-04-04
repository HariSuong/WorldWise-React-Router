/* eslint-disable react/prop-types */
import styles from './CityList.module.css'
import Spinner from '../components/Spinner'
import CityItem from './CityItem'
import Message from './Message'

const CityList = ({ cities, isLoading }) => {
  if (isLoading && cities.length) return <Spinner />
  if (!cities.length)
    return (
      <Message message='Add your first city by clicking on a city on the map' />
    )

  return (
    <ul className={styles.cityList}>
      {cities.map(city => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  )
}

export default CityList
