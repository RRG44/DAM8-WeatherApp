import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image} from 'react-native';

let bColor = "#fff"
let tColor = "#000"

function changeColor (isDay){
  let arr = ["#fff", "#000"]
  if (isDay == 0){
    arr[0] = "#000"
    arr[1] = "#fff"
  }
  return arr
}

export default function App() {

  const [city, setCity] = useState('');
  const [weatherData, setweatherData] = useState(null);
  const [error, setError] = useState(null);
  const [btnTxt, setBtnTxt] = useState("Get Weather");
  const [isDay, setIsDay] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const fetchWeatherData = async () => {
    
    if (city != '' && weatherData != null) {
      setCity('')
      setBtnTxt("Get Weather")
      setIsDay(1)
      setweatherData(null)
      setIsVisible(true)
    }
    else{

      const API_KEY = '761f1121d5084e94a48192038242102'
      
      try{
        const res = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=no`)
        const data = await res.json();
        setBtnTxt("Clean Data")
        setweatherData(data);
        setIsDay(data.current.is_day);
        setIsVisible(false)
        setError(null);
      }
      catch (e){
        console.error(e)
        setError('Error fetching weather data');
        setCity('')
        setBtnTxt("Get Weather")
        setIsDay(1)
        setweatherData(null)
        setIsVisible(true)
      }
    }
  };

  useEffect( () => {
    city ? fetchWeatherData : setError;
  }, [city]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDay == 1 ? "#fff" : "#000"}]}>
      {weatherData && (
        <>
        <View style={styles.tempContainer}>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff", fontSize: 50}]}>{weatherData.current.temp_c}°C</Text>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff"}]}>{weatherData.location.name}, {weatherData.location.region}, {weatherData.location.country}</Text>
        </View>
        <View styles={styles.weatherDataContainer}>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff"}]}>Temperature 🌡️: {weatherData.current.temp_c}°C</Text>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff"}]}>Description ⛅: {weatherData.current.condition.text}</Text>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff"}]}>Time 🕐: {weatherData.location.localtime}</Text>
          <Text style={[styles.weatherTxt, {color: isDay == 1 ? "#000" : "#fff", fontWeight : 800}]}>{weatherData.location.name} is {weatherData.current.is_day == 1 ? "awake 😄" : "sleeping 😴"}</Text>
        </View>
        </>
      )}
      {isVisible &&
      <>
      <Text style={[styles.title, {color: isDay == 1 ? "#000" : "#fff", }]}>Welcome to WeatherApp ⛅</Text>
      <TextInput 
        style={[styles.textInput, {color: isDay == 1 ? "#000" : "#fff"}]}
        placeholder='Enter your location'
        value={city}
        onChangeText={(text) =>{
          setCity(text);
        }}
      />
      </>
      }
      <TouchableOpacity 
        style={styles.button}
        onPress={fetchWeatherData}>
        <Text style = {styles.buttonTxt}>{btnTxt}</Text>
      </TouchableOpacity>
      {error && (<Text>{error}</Text>)}
      {/* {weatherData && (
        <View styles={styles.weatherDataContainer}>
        
        </View>)} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: bColor,
  },
  title :
  {
    fontSize : 20,
    fontWeight: 'bold',
    marginVertical : 40,
    color : tColor,
  },
  textInput :
  {
    height: 50,
    width: '80%',
    padding: 5,
    borderWidth: 2,
    fontSize : 16,
    textAlign: 'center',
    borderRadius: 5,
    borderColor: '#999',
    color : tColor,
  },
  button :
  {
    backgroundColor: '#0275d8',
    width: 200,
    height: 60,
    borderRadius: 5,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin : 30,
  },
  weatherTxt :
  {
    fontSize : 16,
    margin: 5,
    color : tColor,
  },
  buttonTxt : 
  {
    color : 'white',
    fontSize : 16,
    fontWeight: 'bold',
  },
  weatherDataContainer : 
  {
    
  },
  tempContainer : 
  {
    marginBottom: 30,
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
  },
});
