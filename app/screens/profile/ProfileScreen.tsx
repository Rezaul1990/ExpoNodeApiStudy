import { Profile } from '@/models/Profile';
import {
  addProfile,
  deleteProfile,
  getProfileData,
  updateProfile
} from '@/services/profileService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert, Button, FlatList, Image,
  Text, TextInput, View
} from 'react-native';

export default function ProfileScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    phonenumber: '',
    role: '',
    profilePhoto: null as string | null,
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw 'Token not found';
      const data = await getProfileData(token);
      setProfiles(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleImagePick = () => {
  Alert.alert(
    'Select Image Source',
    'Choose an option',
    [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });
          if (!result.canceled && result.assets[0]) {
            setForm({ ...form, profilePhoto: result.assets[0].uri });
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });
          if (!result.canceled && result.assets[0]) {
            setForm({ ...form, profilePhoto: result.assets[0].uri });
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
};


  const handleDelete = (id: string) => {
    Alert.alert('Confirm Deletion', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          await deleteProfile(id);
          fetchProfiles();
        },
      },
    ]);
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setForm({
      firstname: profile.firstname || '',
      lastname: profile.lastname || '',
      phonenumber: profile.phonenumber || '',
      role: profile.role || '',
      profilePhoto: null,
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('firstname', form.firstname);
      formData.append('lastname', form.lastname);
      formData.append('phonenumber', form.phonenumber);
      formData.append('role', form.role);

      if (form.profilePhoto) {
        const filename = form.profilePhoto.split('/').pop()!;
        const type = `image/${filename.split('.').pop()}`;
        formData.append('profilePhoto', {
          uri: form.profilePhoto,
          name: filename,
          type,
        } as any);
      }

      if (editingProfile) {
        await updateProfile(editingProfile._id!, formData);
        Alert.alert('Success', 'Profile updated');
      } else {
        await addProfile(formData);
        Alert.alert('Success', 'Profile added');
      }

      setForm({ firstname: '', lastname: '', phonenumber: '', role: '', profilePhoto: null });
      setEditingProfile(null);
      fetchProfiles();
    } catch (err) {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <View style={{
      flex: 1, margin: 10, padding: 10, borderWidth: 1,
      borderRadius: 10, alignItems: 'center'
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

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Edit" onPress={() => handleEdit(item)} />
        <Button title="Delete" color="red" onPress={() => handleDelete(item._id!)} />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        {editingProfile ? 'Update Profile' : 'Add New Profile'}
      </Text>

      <TextInput
        placeholder="First Name"
        value={form.firstname}
        onChangeText={(text) => setForm({ ...form, firstname: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Last Name"
        value={form.lastname}
        onChangeText={(text) => setForm({ ...form, lastname: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Phone"
        value={form.phonenumber}
        onChangeText={(text) => setForm({ ...form, phonenumber: text })}
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Role"
        value={form.role}
        onChangeText={(text) => setForm({ ...form, role: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Pick Image" onPress={handleImagePick} />
      {form.profilePhoto && (
        <Image source={{ uri: form.profilePhoto }} style={{ width: 100, height: 100, marginVertical: 10 }} />
      )}
      <Button title={editingProfile ? 'Update' : 'Save'} onPress={handleSubmit} />

      <FlatList
        data={profiles}
        keyExtractor={(item) => item._id!}
        renderItem={renderItem}
        numColumns={2}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}
