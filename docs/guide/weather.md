# Weather

::: tip COMPATIBILITY NOTE
This is an optional step. If you don't set the `WEATHER_API_KEY` unset, the 
application will still work, just without setting the weather for you.
:::

Open Apiary uses the [OpenWeather API](https://openweathermap.org/api) to get
weather data and is used to pre-populate the weather data for new inspections. 

To get a token, please visit the [registration page](https://openweathermap.org/appid)
for OpenWeather. The Free Tier is perfectly acceptable for Open Apiary - it only
uses the current weather API and caches calls for 10 minutes avoiding any problems
with rate-limiting.

When you have gotten the token, please set it as `WEATHER_API_KEY`. See the 
[config](./../config) page for information on how to set it.w
