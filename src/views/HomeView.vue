<script setup>
import { ref, onMounted, computed } from 'vue'
import { getWeather } from '../services/weatherService'


// weather icons
import sunIcon from '../assets/images/sunIcon.png'
import cloudIcon from '../assets/images/cloudIcon.png'
import rainIcon from '../assets/images/rainIcon.png'
import stormIcon from '../assets/images/stormIcon.png'
import snowIcon from '../assets/images/snowIcon.png'

// main state values
const city = ref('')
const weather = ref(null)
const error = ref('')
const savedLocations = ref([])

// choose an icon based on the current weather text
const weatherIcon = computed(() => {
  if (!weather.value) return null

  const condition = weather.value.current.condition.text.toLowerCase()

  if (condition.includes('thunder') || condition.includes('storm')) {
    return stormIcon
  }
  if (condition.includes('rain')) return rainIcon
  if (condition.includes('snow')) return snowIcon
  if (condition.includes('cloud')) return cloudIcon
  if (condition.includes('clear') || condition.includes('sunny')) return sunIcon

  return sunIcon
})

// fetch weather for the entered city
async function searchWeather() {
  try {
    error.value = ''
    weather.value = await getWeather(city.value)

    localStorage.setItem('lastCity', city.value)
    localStorage.setItem('lastWeather', JSON.stringify(weather.value))

    city.value = ''
  } catch (e) {
    error.value = 'Could not fetch weather'
  }
}

// save the current location to the list
function saveLocation() {
  if (!weather.value) return

  const name = weather.value.location.name

  if (!savedLocations.value.includes(name)) {
    savedLocations.value.push(name)
    localStorage.setItem('locations', JSON.stringify(savedLocations.value))
  }
}

// remove a saved location
function removeLocation(loc) {
  savedLocations.value = savedLocations.value.filter(l => l !== loc)
  localStorage.setItem('locations', JSON.stringify(savedLocations.value))
}

// load weather for a saved location
function loadLocation(loc) {
  city.value = loc
  searchWeather()
}

// load saved data when the page opens
onMounted(() => {
  const last = localStorage.getItem('lastCity')

  if (last) {
    city.value = last
    searchWeather()
  }

  const stored = localStorage.getItem('locations')
  if (stored) savedLocations.value = JSON.parse(stored)
})


</script>

<template>
  <div class="page-wrapper">

    <div class="overlay"></div>

    <div class="content">

      <div class="container d-flex flex-column align-items-center mt-5">

        <h1 class="app-title">Weather App</h1>

        <!-- search box -->
        <div class="card-box">
          <h2 class="mb-3">Search for a City</h2>

          <input
            v-model="city"
            class="form-control mb-2"
            placeholder="Enter city"
          />

          <button class="btn btn-primary" @click="searchWeather">
            Search
          </button>

          <p v-if="error" class="text-danger mt-2">{{ error }}</p>
        </div>

        <!-- weather box -->
        <div v-if="weather" class="card-box">
          <h2 class="city-name">{{ weather.location.name }}</h2>

          <div class="weather-icon">
            <img :src="weatherIcon" />
          </div>

          <p class="condition">
            {{ weather.current.condition.text }}
          </p>

          <p class="temp">
            {{ weather.current.temp_f }}°F
          </p>

          <div class="highlow">
            <p>High: {{ weather.forecast.forecastday[0].day.maxtemp_f }}°F</p>
            <p>Low: {{ weather.forecast.forecastday[0].day.mintemp_f }}°F</p>
          </div>

          <button class="btn btn-success mt-3" @click="saveLocation">
            Save Location
          </button>
        </div>

        <!-- saved locations box -->
        <div v-if="savedLocations.length" class="card-box">
          <h3>Saved Locations</h3>

          <div
            v-for="loc in savedLocations"
            :key="loc"
            class="d-flex justify-content-between align-items-center mb-2"
          >
            <span @click="loadLocation(loc)" style="cursor:pointer">
              {{ loc }}
            </span>

            <button class="btn btn-sm btn-danger" @click="removeLocation(loc)">
              X
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
.page-wrapper {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1;
}

/* content */
.content {
  position: relative;
  z-index: 2;
  padding-top: 20px;
}

/* title */
.app-title {
  color: white;
  text-align: center;
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 25px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.4);
}

/* cards */
.card-box {
  background: rgba(255,255,255,0.92);
  padding: 25px;
  border-radius: 18px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  backdrop-filter: blur(6px);
}

/* icon */
.weather-icon img {
  width: 90px;
  height: 90px;
  margin: 10px 0;
}

/* text */
.city-name {
  font-size: 1.8rem;
  font-weight: 700;
}

.temp {
  font-size: 2.5rem;
  font-weight: bold;
}

.condition {
  color: #444;
}
</style>
