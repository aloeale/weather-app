<script setup>
import { ref, onMounted, computed } from 'vue'
import { getWeather } from '../services/weatherService'

import clearImg from '../assets/images/clear.jpg'
import rainImg from '../assets/images/rain.jpg'
import cloudsImg from '../assets/images/clouds.png'
import nightImg from '../assets/images/night.jpg'

// main state for this view
const city = ref('')
const displayCity = ref('')
const forecast = ref([])
const weather = ref(null)

// get the last searched city
function getCity() {
  return localStorage.getItem('lastCity')
}


// load saved city when the page opens
onMounted(() => {
  const saved = getCity()

  if (saved) {
    city.value = saved
    loadForecast(saved)
  }
})

// fetch 3 day forecast
async function loadForecast(inputCity) {
  const query = inputCity || city.value || getCity()
  if (!query) return

  try {
    const data = await getWeather(query)

    weather.value = data
    forecast.value = data.forecast.forecastday
    displayCity.value = query

    localStorage.setItem('lastWeather', JSON.stringify(data))

    localStorage.setItem('lastCity', query)
    city.value = ''
  } catch (err) {
    console.error('Forecast fetch failed', err)
  }
}
</script>

<template>
  <div class="page-wrapper">

    <div class="overlay"></div>

    <div class="content">

      <div class="container py-5">

        <div class="card p-4 shadow-sm text-center">

          <h1 class="mb-4">3 Day Forecast</h1>

          <input
            v-model="city"
            class="form-control mb-2"
            placeholder="Enter city"
          />

          <button
            class="btn btn-primary mb-3"
            @click="loadForecast(city)"
          >
            Search
          </button>

          <h3 v-if="displayCity" class="text-muted mb-3">
            {{ displayCity }}
          </h3>

          <table v-if="forecast.length" class="table table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Condition</th>
                <th>High</th>
                <th>Low</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="day in forecast" :key="day.date">
                <td>{{ day.date }}</td>
                <td>{{ day.day.condition.text }}</td>
                <td>{{ day.day.maxtemp_f }}°F</td>
                <td>{{ day.day.mintemp_f }}°F</td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>
    </div>
  </div>
</template>