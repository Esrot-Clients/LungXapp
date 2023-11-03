import { StyleSheet, Text, ToastAndroid, View, ScrollView, StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserInfoCard from '../components/Molecules/UserInfoCard';
import { BtnContain } from '../components/Atoms/Button';
import metrics from '../constants/layout';
import TextinputwithEditButton from '../components/Molecules/TextInputWithEdit';
import colors from '../constants/colors';
import LungXinstance from '../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/Atoms/LoadingScreen';

export default function ProfileScreen() {

  const [loading, setloading] = useState(false);
  const { user, setUser, DoctorLogout, loadingactivity } = useContext(AuthContext);
  const [firstName, setfirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [phno, setphno] = useState(user?.mobile);
  const [email, setemail] = useState(user?.email);
  const [address, setaddress] = useState(user?.address);
  const [city, setCity] = useState(user?.city);
  const [hospitalName, setHospitalName] = useState(user?.hospital);
  const [speciality, setSpeciality] = useState(user?.doc_dept);

  const handleUpdateUserFirstName = async () => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/update_user_info/', {
        first_name: firstName,
      });
      if (response?.data) {
        setUser({
          ...user,
          first_name: response?.data?.first_name,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            first_name: response?.data?.first_name,
          }),
        );
        ToastAndroid.show('First Name Updated', ToastAndroid.LONG);
      }
      setloading(false)


    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserLastName = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/update_user_info/', {
        last_name: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          last_name: response?.data?.last_name,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            last_name: response?.data?.last_name,
          }),
        );
        ToastAndroid.show('Last Name Updated', ToastAndroid.LONG);
      }
      setloading(false)


    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserMobileNumber = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/update_user_info/', {
        mobile: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          mobile: response?.data?.mobile,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            mobile: response?.data?.mobile,
          }),
        );
        ToastAndroid.show('Mobile Number Updated', ToastAndroid.LONG);
      }
      setloading(false)

    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserAddress = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/user_profile/', {
        address: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          address: response?.data?.address,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            address: response?.data?.address,
          }),
        );
        ToastAndroid.show('Address Updated', ToastAndroid.LONG);
      }
      setloading(false)

    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserCity = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/user_profile/', {
        city: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          city: response?.data?.city,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            city: response?.data?.city,
          }),
        );
        ToastAndroid.show('City Updated', ToastAndroid.LONG);
      }
      setloading(false)

    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserSpecility = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/user_profile/', {
        doc_dept: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          doc_dept: response?.data?.doc_dept,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            doc_dept: response?.data?.doc_dept,
          }),
        );
        ToastAndroid.show('Speciality Updated', ToastAndroid.LONG);
      }
      setloading(false)

    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserHospital = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/user_profile/', {
        hospital: text,
      });
      if (response?.data) {
        setUser({
          ...user,
          hospital: response?.data?.hospital,
        })
        await AsyncStorage.mergeItem(
          'user',
          JSON.stringify({
            hospital: response?.data?.hospital,
          }),
        );
        ToastAndroid.show('Hospital Name Updated', ToastAndroid.LONG);
      }
      setloading(false)

    } catch (err) {
      console.log("Error Occurred", err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <StatusBar backgroundColor={'#fff'}  barStyle="dark-content" />

      {/* {
        loading ? <LoadingScreen /> : null
      } */}

      <UserInfoCard />

      <TextinputwithEditButton
        label="First Name"
        value={firstName}
        onUpdate={handleUpdateUserFirstName}
        handleonChangeText={(txt) => setfirstName(txt)}
      />
      <TextinputwithEditButton
        label="Last Name"
        value={lastName}
        onUpdate={handleUpdateUserLastName}
        handleonChangeText={(txt) => setLastName(txt)}
      />

      <TextinputwithEditButton
        label="Mobile Number"
        value={phno}
        keyboardtype="numeric"
        onUpdate={handleUpdateUserMobileNumber}
        handleonChangeText={(txt) => setphno(txt)}
      />
      <TextinputwithEditButton
        label="Email address"
        value={email}
        emailEditHide={true}
      />
      <TextinputwithEditButton
        label="Address"
        value={address}
        onUpdate={handleUpdateUserAddress}
        handleonChangeText={(txt) => setaddress(txt)}
      />

      <TextinputwithEditButton
        label="City"
        value={city}
        onUpdate={handleUpdateUserCity}
        handleonChangeText={(txt) => setCity(txt)}
      />

      <TextinputwithEditButton
        label="Speciality"
        value={speciality}
        onUpdate={handleUpdateUserSpecility}
        handleonChangeText={(txt) => setSpeciality(txt)}
      />

      <TextinputwithEditButton
        label="Hospital Name"
        value={hospitalName}
        onUpdate={handleUpdateUserHospital}
        handleonChangeText={(txt) => setHospitalName(txt)}
      />

      {
        loadingactivity && (
          <LoadingScreen />
        )
      }

      <View style={{ width: metrics.screenWidth * 0.4, margin: 15 }}>
        <BtnContain
          label="logout"
          icon="logout"
          color={colors.green}
          onPress={() => DoctorLogout()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    padding: 20,
    marginVertical: 15,
  },

});
