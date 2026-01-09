import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { observer } from "mobx-react-lite"
import { useStores } from "@/models"

export const MechanicalSystemsStep1Screen = observer(function MechanicalSystemsStep1Screen() {
  const { assessment } = useStores()
  
  // Access the store: assessment.mechanicalSystems.step1
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mechanical Systems - Step 1</Text>
      <Text style={styles.subtitle}>HVAC Individual Units</Text>
      {/* TODO: Build form UI */}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
})

