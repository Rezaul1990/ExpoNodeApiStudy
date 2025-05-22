import { Profile } from '@/models/Profile';
import { getEnrolledClasses } from '@/services/classService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const DashboardScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const storedProfile = await AsyncStorage.getItem('selectedProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      try {
        const data = await getEnrolledClasses();
        setEnrolledClasses(data);
      } catch (err) {
        console.error('Error loading enrolled classes:', err);
      }
    };

    loadData();
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

      <Text style={[styles.text, { marginTop: 20, fontWeight: 'bold' }]}>Your Enrolled Classes:</Text>
      {enrolledClasses.length === 0 ? (
        <Text>No classes enrolled yet.</Text>
      ) : (
        <FlatList
          data={enrolledClasses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text style={styles.classTitle}>{item.name}</Text>
              <Text>{item.date?.slice(0, 10)}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  text: { fontSize: 16, marginBottom: 10 },
  classItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  classTitle: { fontWeight: 'bold', fontSize: 16 },
});
