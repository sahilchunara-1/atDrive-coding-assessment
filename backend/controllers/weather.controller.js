
import axios from 'axios';

const weatherController = {

    getWeather: async (req, res) => {
        try {
            const { lat, lon } = req.query;

            if (!lat || !lon) {
                return res.status(400).json({
                    success: false,
                    message: 'lat and lon query parameters are required',
                });
            }

            const url = process.env.WEATHER_API_KEY.replace('${lat}', lat).replace('${lon}', lon);

            const response = await axios.get(url);

            const { current_weather } = response.data;

            if (!current_weather) {
                return res.status(502).json({
                    success: false,
                    message: 'Weather data unavailable from provider',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Weather fetched successfully',
                data: {
                    temperature: current_weather.temperature,
                    windSpeed: current_weather.windspeed,
                    weatherCode: current_weather.weathercode,
                    time: current_weather.time,
                },
            });
        } catch (error) {
            console.log('error in fetching weather --->', error.message);
            return res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
        }
    },
};

export default weatherController;