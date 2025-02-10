import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import { Barometer } from "expo-sensors";
// import accelerometer from "expo-sensors/src/Accelerometer";

const styles = StyleSheet.create({
  container: {

  },
});

export default function App() {
    const [data, setData] = useState({
        pressure: 0,
        relativeAltitude: 0,
    });

    useEffect(() => {
        // Set the update interval for the Barometer
        Barometer.setUpdateInterval(100);

        // Subscribe to Barometer updates
        const subscription = Barometer.addListener((barometerData) => {
            setData({
                pressure: barometerData.pressure || 0, // Pressure in hPa
                relativeAltitude: barometerData.relativeAltitude || 0, // Altitude in meters (iOS only)
            });
        });

        // Cleanup subscription on component unmount
        return () => subscription.remove();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.text}>Barometer Data:</Text>
            <Text style={styles.text}>Pressure: {data.pressure.toFixed(2)} hPa</Text>
            <Text style={styles.text}>
                Relative Altitude: {data.relativeAltitude ? data.relativeAltitude.toFixed(2) : "N/A"} m
            </Text>
        </View>
    );
}

