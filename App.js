import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";

import useCachedResources from "./src/hooks/useCachedResources";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import { AddPatientProvider } from "./src/context/AddPatientContext";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

import { ExpoAudioStreamModule } from "@siteed/expo-audio-stream";
const queryClient = new QueryClient();

export default function App() {
  const requestPermissions = async () => {
    const { granted } = await ExpoAudioStreamModule.requestPermissionsAsync();
    if (granted) {
      console.log("Microphone permissions granted");
    } else {
      console.log("Microphone permissions denied");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AddPatientProvider>
              <Navigation />
            </AddPatientProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    );
  }
}
