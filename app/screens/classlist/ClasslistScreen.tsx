import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const ClasslistScreen = () => {
  return (
    <View style={styles.container}>
      <Text>ClasslistScreen</Text>
    </View>
  )
}

export default ClasslistScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})