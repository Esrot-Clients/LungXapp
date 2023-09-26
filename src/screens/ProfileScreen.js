import {StyleSheet, Text, ToastAndroid, View,ScrollView} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import UserInfoCard from '../components/Molecules/UserInfoCard';
import {BtnContain} from '../components/Atoms/Button';
import metrics from '../constants/layout';
import TextinputwithEditButton from '../components/Molecules/TextInputWithEdit';
import colors from '../constants/colors';
import LungXinstance from '../api/server';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../components/Atoms/LoadingScreen';

export default function ProfileScreen() {

  const [loading, setloading] = useState(false);
  const {user, setUser, DoctorLogout, loadingactivity} = useContext(AuthContext);
  const [name, setname] = useState(user?.first_name);
  const [phno, setphno] = useState(user?.mobile);
  const [email, setemail] = useState(user?.email);
  const [address, setaddress] = useState(user?.address);
 


  const handleTextInput = (text) => {
    console.log(text);
    setname(text);
  };
  const handlepTextInput = (text) => {
    console.log(text);
    setphno(text)
  };

  const handleeTextInput = (text) => {
    console.log(text);
    setemail(text)
  };

  const handleaTextInput = (text) => {
    console.log(text);
    setaddress(text)
  };

  const handleCancel = (initialValue) => {
    // Update the state in the parent component
    setname(initialValue);
  };

  const handleUpdateUserMobileNumber = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/update_user_info/', {
        mobile: text,
      });
      // console.log(JSON.stringify(response.data, null, 2));
      setUser({
        ...user,
        mobile: text,
      })
      await AsyncStorage.mergeItem(
        'user',
        JSON.stringify({
          mobile: text,
        }),
      );
      ToastAndroid.show('Phone Number Updated', ToastAndroid.LONG);
      setloading(false)

    } catch (err) {
      console.log("Error Occurred",err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  const handleUpdateUserEmailAddress = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/user_profile/', {
        email: text,
      });
      // console.log(JSON.stringify(response.data, null, 2));
      setUser({
        ...user,
        email: text,
      })
      await AsyncStorage.mergeItem(
        'user',
        JSON.stringify({
          email: text,
        }),
      );
      ToastAndroid.show('Email Address Updated', ToastAndroid.LONG);
      setloading(false)

    } catch (err) {
      console.log("Error Occurred",err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };
  const handleUpdateUserName = async (text) => {
    try {
      setloading(false)
      const response = await LungXinstance.patch('api/update_user_info/', {
        first_name: text,
      });
      setUser({
        ...user,
        first_name: text,
      })
      await AsyncStorage.mergeItem(
        'user',
        JSON.stringify({
          first_name: text,
        }),
      );
      ToastAndroid.show('Name Updated', ToastAndroid.LONG);
      setloading(false)

    } catch (err) {
      console.log("Error Occurred",err);
      ToastAndroid.show('Error', ToastAndroid.LONG);
      setloading(false)
    }
  };

  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {
        loading ? <LoadingScreen /> : null
      } */}
      <UserInfoCard  profile={user?.profile_picture}/>
      <TextinputwithEditButton
        label="Name"
        value={name}
        onUpdate={handleUpdateUserName}
        handleonChangeText={handlepTextInput}
        onCancel={handleCancel}
      />
      <TextinputwithEditButton
        label="Phone number"
        value={phno}
        onUpdate={handleUpdateUserMobileNumber}
        handleonChangeText={handlepTextInput}
        onCancel={() => {}}
      />
      <TextinputwithEditButton
        label="Email address"
        value={email}
        onUpdate={handleUpdateUserEmailAddress}
        handleonChangeText={handleeTextInput}
        onCancel={() => {}}
      />
      <TextinputwithEditButton
        label="Address"
        value={address}
        onUpdate={() => {}}
        handleonChangeText={handleaTextInput}
        onCancel={() => {}}
      />

      {
        loadingactivity && (
          <LoadingScreen />
        )
      }

      <View style={{width: metrics.screenWidth * 0.4}}>
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
