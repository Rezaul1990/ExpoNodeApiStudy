import {
  addProfile,
  deleteProfile,
  updateProfile
} from '@/services/profileService';
import { useAuthStore } from '@/store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

export default function YourProfileScreen() {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  const [form, setForm] = useState({
    firstname: profile?.firstname || '',
    lastname: profile?.lastname || '',
    phonenumber: profile?.phonenumber || '',
    role: profile?.role || '',
    profilePhoto: null as string | null,
  });

  const [isNewProfile, setIsNewProfile] = useState(false);

  if (!profile && !isNewProfile) {
  return (
    <View style={styles.container}>
      <Text style={styles.warning}>⚠️ No profile selected.</Text>
      {profile?.role === 'admin' && (
        <Button
          title="New Profile"
          onPress={() => {
            setIsNewProfile(true);
            setForm({
              firstname: '',
              lastname: '',
              phonenumber: '',
              role: '',
              profilePhoto: null,
            });
          }}
        />
      )}
    </View>
  );
}

  const handleImagePick = () => {
    Alert.alert('Select Image Source', 'Choose an option', [
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
      { text: 'Cancel', style: 'cancel' },
    ]);
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

      if (isNewProfile) {
        await addProfile(formData);
        Alert.alert('Success', 'New profile created!');
        setIsNewProfile(false);
      } else if (profile?._id) {
        await updateProfile(profile._id, formData);
        Alert.alert('Success', 'Profile updated!');
      }

    } catch (err) {
      Alert.alert('Error', 'Failed to save');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Profile', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            if (profile?._id) {
              await deleteProfile(profile._id);
              setProfile(null);
              Alert.alert('Deleted', 'Profile has been deleted.');
            }
          } catch (err) {
            Alert.alert('Error', 'Delete failed');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isNewProfile ? 'Create New Profile' : 'Your Profile'}
      </Text>

      <TextInput
        placeholder="First Name"
        value={form.firstname}
        onChangeText={(text) => setForm({ ...form, firstname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={form.lastname}
        onChangeText={(text) => setForm({ ...form, lastname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={form.phonenumber}
        onChangeText={(text) => setForm({ ...form, phonenumber: text })}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Role"
        value={form.role}
        onChangeText={(text) => setForm({ ...form, role: text })}
        style={styles.input}
      />

      <Button title="Pick Image" onPress={handleImagePick} />
      {form.profilePhoto ? (
        <Image source={{ uri: form.profilePhoto }} style={styles.image} />
      ) : !isNewProfile && profile?.profilePhoto ? (
        <Image
          source={{ uri: `http://192.168.0.156:5000/uploads/${profile.profilePhoto}` }}
          style={styles.image}
        />
      ) : (
        <Text style={{ marginVertical: 10 }}>No Photo</Text>
      )}

      {profile?.role === 'admin' && (
        <Button title={isNewProfile ? 'Save Profile' : 'Update'} onPress={handleSubmit} />
      )}

      {!isNewProfile && profile?.role === 'admin' && (
        <View style={{ marginTop: 12 }}>
          <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
      )}

      {!isNewProfile && (
        <View style={{ marginTop: 20 }}>
          {profile?.role === 'admin' && (
            <Button
              title="New Profile"
              onPress={() => {
                setIsNewProfile(true);
                setForm({
                  firstname: '',
                  lastname: '',
                  phonenumber: '',
                  role: '',
                  profilePhoto: null,
                });
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  warning: { fontSize: 18, color: 'red', marginBottom: 20, textAlign: 'center' },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 10,
  },
});
