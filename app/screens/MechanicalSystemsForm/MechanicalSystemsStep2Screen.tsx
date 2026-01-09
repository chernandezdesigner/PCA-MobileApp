import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"

export const MechanicalSystemsStep2Screen = observer(function MechanicalSystemsStep2Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mechanical Systems - Step 2</Text>
      <Text style={styles.subtitle}>Misc Units (Unit Heaters, Air Handling, Exhaust Fans)</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#666" },
})

