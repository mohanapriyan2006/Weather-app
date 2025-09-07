import { EXPO_PUBLIC_API_URL } from '@env';
import axios from "axios";

const API = EXPO_PUBLIC_API_URL;

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`;
const locationsEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API}&q=${params.cityName}`;

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }
    try {
        const res = await axios.request(options);
        return res;
    } catch (err) {
        console.log('error', err);
        return null;
    }
}

export const fetchWeatherForeCast = params => {
    return apiCall(forecastEndpoint(params));
}

export const fetchWeatherLocations = params => {
    return apiCall(locationsEndpoint(params));
}