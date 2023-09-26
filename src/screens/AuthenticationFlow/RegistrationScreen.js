import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState, useContext} from 'react';

// import metrics from '../constants/layout';
// import colors from '../constants/colors';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import TextinputwithIcon from '../components/Molecules/TextInputWithIcon';
// import { AuthContext } from '../context/AuthContext';
// import { BtnContain } from '../components/Atoms/Buttons';
// import LoadingScreen from '../components/Atoms/LoginScreen';

import { BtnContain } from '../../components/Atoms/Button';
import metrics from '../../constants/layout';
import { AuthContext } from '../../context/AuthContext';
import TextinputwithIcon from '../../components/Molecules/TextInputWithIcon';
import colors from '../../constants/colors';
import { Title } from '../../components/Atoms/Typography';
import LoadingScreen from '../../components/Atoms/LoadingScreen';

export default function RegistrationScreen({navigation}) {

  const { DoctorRegistration, loadingactivity } = useContext(AuthContext)

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');

  const handleFirstname = (text) => {
    setFirstname(text);
  };

  const handleLastname = (text) => {
    setLastname(text);
  };

  const handlePhone = (text) => {
    setPhone(text);
  };

  const handleEmail = (text) => {
    // console.log(text)
    setEmail(text);
  };

  const handlePassword = (text) => {
    setPassword(text);
  };

  const handleConfirmPassword = (text) => {
    setConfirmpassword(text);
  };

  const handleSignUp = () => {
    if(firstname === '' || lastname === '' || phone === '' || password === '' || confirmpassword === '' ){
      Alert.alert('Please fill all fields')
      return
    }
    if(password !== confirmpassword){
      Alert.alert('Passwords do not match')
      return
    }
    DoctorRegistration(firstname, lastname, phone, email, password, confirmpassword)
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
       {loadingactivity ? <LoadingScreen /> : null}
      <Text style={{color: colors.green, fontSize: 20, marginVertical: 25}}>
        Create Your Account
      </Text>

      <TextinputwithIcon
        label="First name"
        placeholder="Enter name here"
        iconName="account-edit-outline"
        onChangeText={handleFirstname}
      />

      <TextinputwithIcon
        label="Last name"
        placeholder="Enter name here"
        iconName="account-edit-outline"
        onChangeText={handleLastname}
      />

      <TextinputwithIcon
        label="Phone number"
        placeholder="Enter name here"
        iconName="phone-dial-outline"
        keyboardtype='number-pad'
        onChangeText={handlePhone}
      />

      <TextinputwithIcon
        label="Email"
        placeholder="Enter email"
        iconName="account-reactivate-outline"
        onChangeText={handleEmail}
      />

      <TextinputwithIcon
        label="Password"
        password={true}
        placeholder="Enter password"
        onChangeText={handlePassword}
      />

      <TextinputwithIcon
        label="Confirm Password"
        password={true}
        placeholder="Enter password"
        onChangeText={handleConfirmPassword}
        onSubmitEditing={handleSignUp}
      />


<View style={{width: metrics.screenWidth * 0.5, marginVertical: 20}}>
        <BtnContain
          label="Register"
          icon="account-plus-outline"
          color={colors.green}
          onPress={handleSignUp}
        />

        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  TextContainer: {
    marginVertical: 15,
  },
});
