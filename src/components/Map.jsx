import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'

const Map = () => {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')

  return (
    <div className={styles.mapContainer} onClick={() => navigate('form')}>
      <h1>
        POSITION
        {lat}, {lng}
      </h1>
    </div>
  )
}

export default Map