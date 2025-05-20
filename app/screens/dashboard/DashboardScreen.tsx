import { router } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const DashboardScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>DashboardScreen</Text>
      <TouchableOpacity onPress={() => router.replace('/screens/profile/ProfileScreen')}>
        <Text>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DashboardScreen

const styles = StyleSheet.create({})