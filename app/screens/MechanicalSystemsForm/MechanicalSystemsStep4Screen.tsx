import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"

export const MechanicalSystemsStep4Screen = observer(function MechanicalSystemsStep4Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mechanical Systems - Step 4</Text>
      <Text style={styles.subtitle}>Boilers (Heat & Plumbing Water)</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 18, color: "#666" },
})

