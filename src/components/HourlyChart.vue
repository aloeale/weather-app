<script setup>
import { ref, onMounted, computed } from 'vue'
import { getWeather } from '../services/weatherService'

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { Line } from 'vue-chartjs'

// register chart components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
)

// main state for this view
const city = ref('')
const displayCity = ref('')
const weather = ref(null)
const chartData = ref(null)

// get the last searched city from storage
function getCity() {
  return localStorage.getItem('lastCity')
}

// load saved city when the page opens
onMounted(() => {
  const saved = getCity()
  if (saved) {
    city.value = saved
    loadHourly(saved)
  }
})

// fetch hourly forecast and build chart data
async function loadHourly(inputCity) {
  const query = inputCity || city.value || getCity()
  if (!query) return

  try {
    const data = await getWeather(query)

    weather.value = data
    displayCity.value = query

    // update global background data
    localStorage.setItem('lastWeather', JSON.stringify(data))

    const hours = data.forecast.forecastday[0].hour

    chartData.value = {
      labels: hours.map(h => h.time.split(' ')[1]),
      datasets: [
        {
          label: 'Temperature (°F)',
          data: hours.map(h => h.temp_f),
          borderColor: 'red',
          fill: false
        },
        {
          label: 'Rain (%)',
          data: hours.map(h => h.chance_of_rain),
          borderColor: 'blue',
          fill: false
        }
      ]
    }

    localStorage.setItem('lastCity', query)
    city.value = ''
  } catch (err) {
    console.error('Weather fetch failed', err)
  }
}
</script>

<template>
  <div class="page-wrapper">

    <div class="overlay"></div>

    <div class="content">

      <div class="container py-5">

        <div class="card p-4 shadow-sm text-center">

          <h1 class="mb-4">Hourly Forecast</h1>

          <input
            v-model="city"
            class="form-control mb-2"
            placeholder="Enter city"
          />

          <button class="btn btn-primary mb-3" @click="loadHourly(city)">
            Search
          </button>

          <h3 v-if="displayCity" class="text-muted mb-3">
            {{ displayCity }}
          </h3>

          <div v-if="chartData">
            <Line :data="chartData" />
          </div>

        </div>

      </div>
    </div>
  </div>
</template>