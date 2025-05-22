import { Profile } from '@/models/Profile';
import { getProfileData } from '@/services/profileService';
import { useAuthStore } from '@/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw 'Token not found';
      const data = await getProfileData(token);
      setProfiles(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load profiles');
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleGoToDashboard = async () => {
    const selected = profiles.find(p => p._id === selectedProfileId);

    if (!selected) {
      Alert.alert('Error', 'Please select a profile');
      return;
    }

    useAuthStore.getState().setProfile(selected);
    await AsyncStorage.setItem('selectedProfile', JSON.stringify(selected));

    router.push('/screens/dashboard/DashboardScreen');
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <TouchableOpacity onPress={() => setSelectedProfileId(item._id!)}>
      <View style={{
        flex: 1,
        margin: 10,
        padding: 10,
        borderWidth: selectedProfileId === item._id ? 2 : 1,
        borderColor: selectedProfileId === item._id ? 'blue' : 'gray',
        borderRadius: 10,
        alignItems: 'center',
      }}>
        <Text>First: {item.firstname}</Text>
        <Text>Last: {item.lastname}</Text>
        <Text>Phone: {item.phonenumber}</Text>
        <Text>Role: {item.role}</Text>
        {item.profilePhoto ? (
          <Image
            source={{ uri: `http://192.168.0.156:5000/uploads/${item.profilePhoto}` }}
            style={{ width: 80, height: 80, borderRadius: 40, marginVertical: 10 }}
          />
        ) : <Text>No Photo</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Select Your Profile
      </Text>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item._id!}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ gap: 10 }}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Go to Dashboard"
          color="green"
          disabled={!selectedProfileId}
          onPress={handleGoToDashboard}
        />
      </View>
    </View>
  );
}
