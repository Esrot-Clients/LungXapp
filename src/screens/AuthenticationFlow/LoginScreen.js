import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useState} from 'react';

import { BtnContain } from '../../components/Atoms/Button';
import metrics from '../../constants/layout';
import { AuthContext } from '../../context/AuthContext';
import TextinputwithIcon from '../../components/Molecules/TextInputWithIcon';
import colors from '../../constants/colors';
import { Title } from '../../components/Atoms/Typography';

import LoadingScreen from '../../components/Atoms/LoadingScreen';

export default function LoginScreen({  navigation }) {
  const {DoctorLogin, loadingactivity} = useContext(AuthContext);

  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');

  const handleEmail = (text) => {
    setemail(text);
  };

  const handlePassword = (text) => {
    setpassword(text);
  };

  return (
    <View style={styles.container}>
      {loadingactivity ? <LoadingScreen loadingMessageState={'Logging In'} /> : null}
      <Text
        style={{
          fontSize: 30,
          marginVertical: 5,
          color: colors.green,
          fontFamily: 'Montserrat-Semibold'
        }}
      >
        Lung X
      </Text>
      <TextinputwithIcon
        label="Email"
        placeholder="Enter email"
        iconName="account-outline"
        onChangeText={handleEmail}
      />
      <TextinputwithIcon
        label="Password"
        password={true}
        placeholder="Enter password"
        onChangeText={handlePassword}
        onSubmitEditing={() => DoctorLogin(email, password)}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: metrics.screenWidth * 0.9,
          paddingVertical: 10,
          paddingLeft: 5,
        }}>
        <Text
          style={{
            color: colors.green,
            fontSize: 12,
            fontFamily: 'Montserrat-Medium',
          }}
          onPress={() => { navigation.navigate('Forgot Password Email')}}>
          Forgot Password?
        </Text>
      </View>

      <View style={{width: metrics.screenWidth * 0.5, marginVertical: 20}}>
        <BtnContain
          label="Login"
          icon="login"
          color={colors.green}
          onPress={() => {
            DoctorLogin(email, password);
          }}
        />

        
      </View>

      <Text
        style={[
          {
            marginTop: 25,
            marginVertical: 0,
          },
        ]}>
        Don't have an account?
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <Title color={colors.green}>
            Sign Up
        </Title>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
