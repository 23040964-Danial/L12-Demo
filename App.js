import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Audio } from 'expo-av';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    shakeText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'red',
    },
});

export default function App() {
    const [data, setData] = useState({ x: 0, y: 0, z: 0 });
    const [previousData, setPreviousData] = useState({ x: 0, y: 0, z: 0 });
    const [isShaking, setIsShaking] = useState(false);
    const [sound, setSound] = useState(null);

    async function playSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('./565035__anzbot__cabasa-2.wav')
            );
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    useEffect(() => {
        const subscription = Accelerometer.addListener((accelerometerData) => {
            setData(accelerometerData);
        });

        Accelerometer.setUpdateInterval(100);

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const diffX = Math.abs(data.x - previousData.x);
        const diffY = Math.abs(data.y - previousData.y);
        const diffZ = Math.abs(data.z - previousData.z);

        const shakeThreshold = 0.5;

        if (diffX > shakeThreshold || diffY > shakeThreshold || diffZ > shakeThreshold) {
            if (!isShaking) {
                console.log('Shake detected!');
                setIsShaking(true);
                playSound();
            }
        } else {
            setIsShaking(false);
        }

        setPreviousData(data);
    }, [data]);

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            {isShaking && <Text style={styles.shakeText}>SHAKE</Text>}
        </View>
    );
}
