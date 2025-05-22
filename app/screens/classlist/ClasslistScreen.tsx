import { ClassModel } from '@/models/Classes';
import { CoachModel } from '@/models/Coach';
import {
  createClass,
  deleteClassById,
  enrollInClass,
  getAllClasses,
  updateClassById,
} from '@/services/classService';
import { getAllCoaches } from '@/services/coachService';
import { useAuthStore } from '@/store/authStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const ClasslistScreen = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [coaches, setCoaches] = useState<CoachModel[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    fetchClasses();
    loadCoaches();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await getAllClasses();
      setClasses(data);
    } catch (err) {
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCoaches = async () => {
    try {
      const data = await getAllCoaches();
      setCoaches(data);
    } catch (err) {
      console.error('Failed to load coaches:', err);
    }
  };

  const openModal = (item?: ClassModel) => {
    if (item) {
      setEditId(item._id);
      setName(item.name);
      setDescription(item.description || '');
      setCost(item.cost?.toString() || '');
      setDate(new Date(item.date));
      setStartTime(new Date(item.startTime));
      setEndTime(new Date(item.endTime));
      setSelectedCoach(item.coaches?.length ? item.coaches[0]._id : '');
    } else {
      setEditId(null);
      setName('');
      setDescription('');
      setCost('');
      setDate(new Date());
      setStartTime(new Date());
      setEndTime(new Date());
      setSelectedCoach('');
    }
    setModalVisible(true);
  };

  const handleDelete = (item: ClassModel) => {
    Alert.alert('Delete Class', `Delete "${item.name}"?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await deleteClassById(item._id);
            fetchClasses();
          } catch (err) {
            console.error('Delete failed:', err);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name,
        description,
        cost: parseFloat(cost),
        date: date.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        coachIds: [selectedCoach],
      };

      if (editId) {
        await updateClassById(editId, payload);
      } else {
        await createClass(payload);
      }

      fetchClasses();
      setModalVisible(false);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleEnroll = async (classId: string) => {
    try {
      const res = await enrollInClass(classId);
      Alert.alert('Success', res.message || 'Successfully enrolled');
    } catch (err: any) {
      console.error('Enroll error:', err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to enroll');
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addButtonText}>➕ Add New Class</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text>Cost: ${item.cost}</Text>
              <Text>Date: {formatDate(new Date(item.date))}</Text>
              <Text>Start: {formatTime(new Date(item.startTime))}</Text>
              <Text>End: {formatTime(new Date(item.endTime))}</Text>
              <Text>
                Coach:{' '}
                {item.coaches?.length
                  ? item.coaches.map((coach) => (
                      <View key={coach._id}>
                        <Text>👤 {coach.name}</Text>
                      </View>
                    ))
                  : 'No coach assigned'}
              </Text>

              <View style={styles.actions}>
                {isAdmin && (
                  <>
                    <Button title="Update" onPress={() => openModal(item)} />
                    <Button title="Delete" color="red" onPress={() => handleDelete(item)} />
                  </>
                )}
                {Array.isArray(item.enrolledUsers) && user && item.enrolledUsers.includes(user._id) ? (
                  <Button title="✅ Enrolled" disabled />
                ) : (
                  <Button title="Enroll Class" color="#0080ff" onPress={() => handleEnroll(item._id)} />
                )}
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Update Class' : 'Add New Class'}</Text>

            <TextInput style={styles.input} placeholder="Class Name" value={name} onChangeText={setName} />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Cost"
              value={cost}
              onChangeText={setCost}
              keyboardType="numeric"
            />

            <Picker
              selectedValue={selectedCoach}
              onValueChange={(value) => setSelectedCoach(value)}
              style={styles.input}
            >
              <Picker.Item label="Select Coach" value="" />
              {coaches.map((coach) => (
                <Picker.Item key={coach._id} label={coach.name} value={coach._id} />
              ))}
            </Picker>

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Class Date"
                value={formatDate(date)}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Start Time"
                value={formatTime(startTime)}
                editable={false}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="End Time"
                value={formatTime(endTime)}
                editable={false}
              />
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={handleSave} disabled={!isAdmin} />
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(e, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(e, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}
    </View>
  );
};

export default ClasslistScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 40 },
  classItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  title: { fontWeight: 'bold', fontSize: 16 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000aa',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
});
