import { ClassModel } from '@/models/Classes';
import { getAdminEnrolledClasses } from '@/services/classService';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const YourprofileScreen = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchClasses = async () => {
    try {
      const data = await getAdminEnrolledClasses();
      console.log('Fetched classes:', data);
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const openUserModal = (users) => {
    setSelectedUsers(users);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Show How many user Enrol One Class</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.classCard}>
            <Text style={styles.className}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Enrolled: {item.enrolledUsers?.length || 0} user(s)</Text>
            <Button title="View Enrolled Users" onPress={() => openUserModal(item.enrolledUsers)} />
          </View>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enrolled Users</Text>

            {selectedUsers.length === 0 ? (
              <Text>No users enrolled.</Text>
            ) : (
              <FlatList
                data={selectedUsers}
                keyExtractor={(user) => user._id}
                renderItem={({ item }) => <Text>📧 {item.email}</Text>}
              />
            )}

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default YourprofileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  classCard: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  className: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: { color: 'white', fontWeight: 'bold' },
});
