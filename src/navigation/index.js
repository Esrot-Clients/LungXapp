import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import colors from "../constants/colors";
import fonts from "../constants/fontsSize";
import metrics from "../constants/layout";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";

// Auth flow screens
import LoginScreen from "../screens/AuthenticationFlow/LoginScreen";
import RegistrationScreen from "../screens/AuthenticationFlow/RegistrationScreen";
import ForgotPasswordEmailScreen from "../screens/AuthenticationFlow/ForgotPasswordEmailScreen";

// Screens
import HomeScreen from "../screens/HomeScreen";
import AnnotationScreen from "../screens/AnnotationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OutpatientListScreen from "../screens/OutpatientListScreen";
import InPatientListScreen from "../screens/InPatientListScreen";
import ReportReceivedScreen from "../screens/ReportReceivedScreen";
import AddPatientScreen from "../screens/AddPatientScreen";
import OutPatientsDetailsScreen from "../screens/OutpatientDetailsScreen";
import AnteriorRecording from "../screens/AnteriorRecording";
import PosteriorRecording from "../screens/PosteriorRecording";
import AnteriorTagging from "../screens/AnteriorTagging";
import PosteriorTagging from "../screens/PosteriorTagging";
import OverallReport from "../screens/OverallReport";
import InPatientSessionsDetailsScreen from "../screens/InPatientSessionsDetailsScreen";
import ForgotPasswordTokenScreen from "../screens/AuthenticationFlow/ForgotPasswordTokenScreen";
import InpatientDetailsSessionScreen from "../screens/InpatientDetailsSessionScreen";

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
    card: colors.white,
    primary: colors.red,
    text: colors.red,
    border: "transparent",
  },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();

export default function Navigation() {
  const { isAuthenticated, apploading } = useContext(AuthContext);
  if (apploading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.green }}>Loading...</Text>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
        {isAuthenticated === false ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Registration"
              component={RegistrationScreen}
              options={{
                headerShown: true,
              }}
            />

            <Stack.Screen
              name="Forgot Password Email"
              component={ForgotPasswordEmailScreen}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="Forgot Password Token"
              component={ForgotPasswordTokenScreen}
              options={{
                headerShown: true,
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Main"
            component={TabNavigation}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName = "";
          if (route.name === "Home") {
            iconName = focused ? "home-outline" : "home-outline";
          } else if (route.name === "Patients list") {
            iconName = focused
              ? "clipboard-list-outline"
              : "clipboard-list-outline";
          } else if (route.name === "Annotations") {
            iconName = focused ? "note-edit-outline" : "note-edit-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "account-outline" : "account-outline";
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={focused ? 25 : 25}
              color={focused ? colors.green : colors.black}
            />
          );
        },

        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          borderTopColor: colors.lightgray,
          borderTopWidth: 0.5,
        },

        tabBarHideOnKeyboard: true,
        headerTintColor: "#000",
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: colors.black,
        tabBarLabelStyle: { fontSize: 12 },
      })}
    >
      <Tab.Screen name="Home" 
        options={{
        headerShown: false,
       }}
      component={HomeScreen} />
      
      <Tab.Screen
        name="Patients list"
        component={PatientDetailsStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Annotations"
        component={AnnotationStack}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function PatientListStack() {
  
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: "none",
          fontSize: fonts.font14,
          fontWeight: "500",
        },
        tabBarInactiveTintColor: colors.black,
        tabBarActiveTintColor: colors.red,

        tabBarIndicatorStyle: {
          backgroundColor: colors.red,
          height: 3,
        },
      }}
    >
      <TopTab.Screen name="Out Patients" component={OutpatientListScreen} />
      <TopTab.Screen name="In Patients" component={InPatientListScreen} />
    </TopTab.Navigator>
  );
}

function PatientDetailsStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen
        name="Patient list"
        component={PatientListStack}
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  // navigation.goBack();
                }}>
                <MaterialIcons name="arrow-back" size={25} color={colors.black} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="Patient Details"
        component={OutPatientsDetailsScreen}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="In Patient Details Session"
        component={InpatientDetailsSessionScreen}
        options={{
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="In Patient Session Details"
        component={InPatientSessionsDetailsScreen}
        options={{
          headerShown: true,
        }}
      />



    </Stack.Navigator>
  );
}

function AnnotationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Annotation"
        component={AnnotationScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Received Report Details"
        component={ReportReceivedScreen}
        options={{
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
