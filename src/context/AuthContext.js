import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LungXinstance from '../api/server';
import {Alert} from 'react-native';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [apploading, setapploading] = useState(false);
  const [loadingactivity, setloadingactivity] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [accessToken, setaccessToken] = useState(null);
  const [refreshToken, setrefreshToken] = useState(null);

  const [user, setUser] = useState(null);

  let handleValidateEmail = (email) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
      return true;
    } else {
      return false;
    }
  };

  const DoctorLogin = async (email, password) => {
    setloadingactivity(true);
    if (email === '' && password == '') {
      Alert.alert('Please enter email and password');
      setloadingactivity(false);
      return;
    }
    if (email === '') {
      Alert.alert('Please enter email');
      setloadingactivity(false);
      return;
    }
    if (password === '') {
      Alert.alert('Please enter password');
      setloadingactivity(false);
      return;
    }
    if (!handleValidateEmail(email)) {
      Alert.alert('Please enter valid email');
      setloadingactivity(false);
      return;
    }
    try {
      const response = await LungXinstance.post('api/login/', {
        email: email,
        password: password,
      });

      // console.log('Login Object', JSON.stringify(response.data, null, 2));

      const {access, refresh, user} = response.data;

      await AsyncStorage.setItem('useraccesstoken', access);
      await AsyncStorage.setItem('userrefreshtoken', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setaccessToken(access);
      setrefreshToken(refresh);
      setUser(user);
      setIsAuthenticated(true);
      setloadingactivity(false);
    } catch (error) {
      if (error.response) {
        console.log('error Object', JSON.stringify(error.response, null, 2));
        Alert.alert(error.response.data.error);
      }
      setloadingactivity(false);
    }
  };

  const DoctorRegistration = async (
    firstname,
    lastname,
    phone,
    email,
    password,
    confirmpassword
  ) => {
    setloadingactivity(true);
    if (!handleValidateEmail(email)) {
      Alert.alert('Please enter valid email');
      setloadingactivity(false);
      return;
    }
    try {
      const response = await LungXinstance.post('api/register/doctor/', {
        first_name: firstname,
        last_name: lastname,
        mobile: phone,
        email: email,
        password: password,
        confirm_password: confirmpassword,
      });

      // console.log('Register Object', JSON.stringify(response.data, null, 2));

      const {access, refresh, user} = response.data;

      await AsyncStorage.setItem('useraccesstoken', access);
      await AsyncStorage.setItem('userrefreshtoken', refresh);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setaccessToken(access);
      setrefreshToken(refresh);
      setUser(user);
      setIsAuthenticated(true);
      setloadingactivity(false);
    } catch (error) {
      if (error.response) {
        console.log('error Object', JSON.stringify(error.response, null, 2));
        if (error.response.data.email) {
          Alert.alert(error.response.data.email[0]);
        }
        if (error.response.data.non_field_errors) {
          Alert.alert(error.response.data.non_field_errors[0]);
        }
      }
      setloadingactivity(false);
    }
  };

  const DoctorLogout = async () => {
    setloadingactivity(true);
    // console.log(refreshToken);
    try {

      // const response = await LungXinstance.post('api/logout/',{
      //   refresh_token: refreshToken,
      // })

      // console.log('Logout Object', JSON.stringify(response, null, 2));

      await AsyncStorage.removeItem('useraccesstoken');
      await AsyncStorage.removeItem('userrefreshtoken');
      await AsyncStorage.removeItem('user');

      setaccessToken(null);
      setrefreshToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setloadingactivity(false);
    } catch (error) {
        console.log(error)
      if (error.response) {
        console.log('error Object', JSON.stringify(error.response, null, 2));
      }
      setloadingactivity(false);
    }
  };

  const IsDoctorLoggedIn = async () => {
    setapploading(true);
    try {
      const access = await AsyncStorage.getItem('useraccesstoken');
      const refresh = await AsyncStorage.getItem('userrefreshtoken');
      const user = await AsyncStorage.getItem('user');

      if (access !== null && refresh !== null && user !== null) {
        setaccessToken(access);
        setrefreshToken(refresh);
        setUser(JSON.parse(user));
        setIsAuthenticated(true);
      }
      setapploading(false);
    } catch (error) {
      console.log(error);
      setapploading(false);
    }
  };

  useEffect(() => {
    IsDoctorLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        DoctorLogin,
        DoctorRegistration,
        DoctorLogout,
        setloadingactivity,
        setUser,
        loadingactivity,
        isAuthenticated,
        apploading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
