<script setup>
import { ref, computed, onMounted } from 'vue'

// background images
import clearImg from './assets/images/clear.jpg'
import rainImg from './assets/images/rain.jpg'
import cloudsImg from './assets/images/clouds.png'
import nightImg from './assets/images/night.jpg'

// holds the last weather data so the background can update across views
const weather = ref(null)

// load saved weather when the app starts
onMounted(() => {
  const saved = localStorage.getItem('lastWeather')
  if (saved) {
    weather.value = JSON.parse(saved)
  }
})

// choose a background image based on the current weather condition
const backgroundStyle = computed(() => {
  if (!weather.value) {
    return {
      backgroundImage: `url(${clearImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }
  }

  const condition = weather.value.current.condition.text.toLowerCase()
  const isNight = weather.value.current.is_day === 0

  let image = clearImg

  if (condition.includes('rain')) image = rainImg
  else if (condition.includes('cloud')) image = cloudsImg
  else if (isNight) image = nightImg

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh'
  }
})
</script>

<template>
  <div :style="backgroundStyle">
    <nav class="custom-nav">
      <router-link to="/" class="nav-btn">Home</router-link>
      <router-link to="/hourly" class="nav-btn">Hourly</router-link>
      <router-link to="/forecast" class="nav-btn">3 Day Forecast</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style>
.custom-nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 15px;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-btn {
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  color: white;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.3);
  transition: 0.2s ease;
}

.nav-btn:hover {
  background: rgba(0, 0, 0, 0.5);
  transform: scale(1.05);
}

.nav-btn.router-link-active {
  background: rgba(255, 255, 255, 0.4);
  color: black;
}
</style>
