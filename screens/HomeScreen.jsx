import { debounce } from "lodash";
import { useCallback, useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarDaysIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { fetchWeatherForeCast, fetchWeatherLocations } from "../api/weather";
import { theme } from '../theme/theme';
import { getData, storeData } from "../utils/asyncStorage";

function HomeScreen() {

    const [showSearch, setShowSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const handleSearch = value => {
        if (value.length > 2) {
            fetchWeatherLocations({ cityName: value }).then(res => {
                setLocations(res.data);
            });
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    const handleLocation = loc => {
        setIsLoading(true);
        setShowSearch(false);
        setLocations([]);
        fetchWeatherForeCast({ cityName: loc.name, days: '7' }).then(res => {
            setWeather(res.data);
            setIsLoading(false);
            storeData('city', loc.name);
        });
    }

    const { current, location } = weather;

    const fetchMyWeatherData = async () => {
        let myCity = await getData('city') || false;
        let myCityName = myCity || "Coimbatore";
        fetchWeatherForeCast({ cityName: myCityName, days: '7' }).then(res => {
            if (res.data) setWeather(res.data);
            setIsLoading(false);
        })
    }

    useEffect(() => {
        fetchMyWeatherData();
    }, []);

    return (
        <View className="flex-1 relative">
            <StatusBar barStyle={'light-content'} />
            <Image blurRadius={50}
                source={require('../assets/images/bg.png')}
                accessibilityLabel="bg image"
                className="absolute h-full w-full" />
            {isLoading ?
                <View className="flex-1 flex flex-col justify-center items-center gap-4">
                    <View className="h-20 w-20 border-[8px] border-b-transparent border-blue-300 animate-spin rounded-full"></View>
                    <Text className="text-blue-200 ml-2 text-lg font-semibold animate-pulse">
                        Loading...</Text>
                </View>
                : <SafeAreaView className='flex flex-1'>
                    {/* Search Section */}
                    <View style={{ height: '7%', width: '90%' }} className="mb-4 border-0 pt-4 mx-4 relative z-50">
                        <View className="flex-row justify-end items-center"
                            style={{ backgroundColor: showSearch ? theme.bgWhite(0.25) : 'transparent', borderRadius: showSearch ? 50 : 0 }}>
                            {
                                showSearch &&
                                <TextInput
                                    onChangeText={handleTextDebounce}
                                    placeholder='Search city'
                                    placeholderTextColor={'lightgray'}
                                    className="h-10 pl-6 flex-1 text-base text-white" />
                            }

                            <TouchableOpacity
                                onPress={() => setShowSearch(!showSearch)}
                                style={{ backgroundColor: theme.bgWhite(0.3) }}
                                className="rounded-full p-3 m-1">
                                <MagnifyingGlassIcon size="25" color="white" />
                            </TouchableOpacity>
                        </View>

                        {locations.length > 0 && showSearch ? (
                            <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                                {
                                    locations.map((loc, index) => {
                                        let showBorder = index + 1 !== locations.length;
                                        let borderClass = showBorder ? " border-b-2 border-gray-300 " : "";
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleLocation(loc)}
                                                key={index}
                                                className={"flex-row gap-2 items-center p-4 mb-1" + borderClass}
                                            >
                                                <MapPinIcon size={20} color={'gray'} />
                                                <Text>{loc.name} , {loc.region}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : null}

                    </View>

                    {/* forecast section */}
                    <View
                        className="mx-6 p-4 flex justify-around flex-1 my-4"
                        style={{ backgroundColor: theme.bgWhite(0.1), borderRadius: 25 }}>

                        {/* location */}
                        <Text className="text-white text-center text-2xl font-bold">
                            {location?.name}
                            <Text className="text-lg font-semibold text-gray-300">
                                , {location?.country}
                            </Text>
                        </Text>

                        {/* weather image */}
                        <View className="flex-row justify-center">
                            <Image
                                source={{ uri: `https:${current?.condition?.icon}` }}
                                style={{ height: 120, width: 120 }}
                                className="-my-10" />
                        </View>

                        {/* Degree celcius */}
                        <View className="space-y-2">
                            <Text className="text-center ml-4 text-4xl font-bold text-white">
                                {current?.temp_c}&#176;
                            </Text>
                            <Text className="text-center text-white text-lg font-semibold tracking-widest">
                                {current?.condition.text}
                            </Text>
                        </View>

                        {/* other stats */}
                        <View className="flex-row justify-between mx-2 gap-4">

                            <View className="flex-row space-x-2 items-center">
                                <Image
                                    source={require('../assets/images/wind.png')}
                                    style={{ height: 30, width: 30 }} />
                                <Text className="text-white font-semibold text-base">{current?.wind_kph} km</Text>
                            </View>


                            <View className="flex-row space-x-2 items-center">
                                <Image
                                    source={require('../assets/images/humidity.png')}
                                    style={{ height: 30, width: 30 }} />
                                <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                            </View>


                            <View className="flex-row space-x-2 items-center">
                                <Image
                                    source={require('../assets/images/sunrise.png')}
                                    style={{ height: 30, width: 30 }} />
                                <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                            </View>

                        </View>

                    </View>

                    {/* forecast for next days */}
                    <View className="mb-6 space-y-3">
                        <View className="flex-row items-center mx-5 my-1 space-x-2">
                            <CalendarDaysIcon size={"22"} color={'white'} />
                            <Text className="text-white text-base">Daily forecast</Text>
                        </View>

                        <ScrollView
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 15 }}
                            showsHorizontalScrollIndicator={false}>
                            {
                                weather?.forecast?.forecastday?.map((item, index) => {
                                    let date = new Date(item.date);
                                    let options = { weekday: 'long' };
                                    let dayName = date.toLocaleDateString('en-US', options);
                                    dayName = dayName.split(',')[0];

                                    return (
                                        <View
                                            key={index}
                                            style={{ backgroundColor: theme.bgWhite(0.15) }}
                                            className="flex justify-center items-center  w-24 rounded-3xl py-3 space-y-1 mr-4">
                                            <Image
                                                source={{ uri: `https:${item?.day?.condition?.icon}` }}
                                                style={{ height: 50, width: 50 }} />
                                            <Text className="text-white">{dayName}</Text>
                                            <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                                        </View>
                                    )
                                }
                                )
                            }

                        </ScrollView>

                    </View>

                </SafeAreaView>
            }

        </View>
    )
}

export default HomeScreen