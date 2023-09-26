import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";

import useCachedResources from "./src/hooks/useCachedResources";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import { AddPatientProvider } from "./src/context/AddPatientContext";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query'
const queryClient = new QueryClient()

export default function App() {
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
