const API_KEY = "474f93ec380f4cdb80c185512261904";

export async function getWeather(city) {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
  );

  if (!response.ok) {
    throw new Error("Weather fetch failed");
  }

  return await response.json();
}