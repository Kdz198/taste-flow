
import envconfig from '@/config'
import axios from 'axios'

 const fetchData = axios.create({
  baseURL: envconfig.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})
export default fetchData



