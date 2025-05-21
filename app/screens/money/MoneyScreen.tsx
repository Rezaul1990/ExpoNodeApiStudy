import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const MoneyScreen = () => {
  return (
    <View style={styles.container}>
      <Text>MoneyScreen</Text>
    </View>
  )
}

export default MoneyScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})