import { Profile } from '@/models/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DashboardScreen = () => {
   const [profile, setProfile] = useState<Profile | null>(null);

   useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = await AsyncStorage.getItem('selectedProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    };

    loadProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {profile.firstname} {profile.lastname}</Text>
      <Text style={styles.text}>Role: {profile.role}</Text>
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 }
})