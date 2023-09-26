import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { Audio } from "expo-av";
import { AuthContext } from "../context/AuthContext";
import metrics from "../constants/layout";
import { Title } from "../components/Atoms/Typography";
import fonts from "../constants/fontsSize";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

// import { Sharing } from 'expo';

import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../constants/colors";
import AddPatientScreen from "./AddPatientScreen";
import AnteriorRecording from "./AnteriorRecording";
import PosteriorRecording from "./PosteriorRecording";
import AnteriorTagging from "./AnteriorTagging";
import PosteriorTagging from "./PosteriorTagging";
import OverallReport from "./OverallReport";
import HomePrimaryScreen from "./HomePrimaryScreen";

export default function HomeScreen({ navigation , route}) {
  const { user } = useContext(AuthContext);
useEffect(()=>{
  navigation.navigate("Patients list")
},[])

  return (
    <>
    <Stack.Navigator   >
      <>
        <Stack.Screen
        name="Add Patient Home"
        component={HomePrimaryScreen}
        options={{
          headerShown: true,
        }}
      />
        <Stack.Screen
        name="Add Patient"
        component={AddPatientScreen}
        options={{
          headerShown: true,
        }}
      />
       <Stack.Screen
        name="Anterior Recording"
        component={AnteriorRecording}
        options={{
          headerShown: true,
        }}
      />
        <Stack.Screen
        name="Posterior Recording"
        component={PosteriorRecording}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Anterior Tagging"  
        component={AnteriorTagging}
        options={{
          headerShown: true,
          
        }}
      />
      <Stack.Screen
        name="Posterior Tagging"
        component={PosteriorTagging}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Overall Report"
        component={OverallReport}
        options={{
          headerShown: true,
          
        }}
      />
      </>
      </Stack.Navigator>
    </>
  )

  // return (
  //   <View style={styles.container}>
  //     <TouchableOpacity
  //       style={styles.IconContainer}
  //       activeOpacity={0.8}
  //       onPress={() =>
  //         navigation.navigate("Patients list", {
  //           screen: "Add Patient",
  //           params: {
  //             screenType: "Entry Point",
  //           },
  //         })
  //       }
  //     >
  //       <MaterialCommunityIcons
  //         name="plus-circle-outline"
  //         color={colors.green}
  //         size={metrics.screenWidth * 0.5}
  //       />
  //       <Title size={fonts.font20} color={colors.green}>
  //         ADD PATIENT
  //       </Title>
  //     </TouchableOpacity>
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  IconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: metrics.screenWidth * 0.85,
    backgroundColor: colors.faintgray,
    borderRadius: 10,
    marginHorizontal: 20,
    paddingVertical: 30,
  },
});
