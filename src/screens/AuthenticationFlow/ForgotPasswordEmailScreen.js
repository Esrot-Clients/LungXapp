import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// import metrics from '../constants/layout';
// import colors from '../constants/colors';
// import LungXinstance from '../api/server';
// import LoadingScreen from '../components/Atoms/LoginScreen';
// import {BtnContain} from '../components/Atoms/Buttons';
// import TextinputwithIcon from '../components/Molecules/TextInputWithIcon';
// import {Title} from '../components/Atoms/Typography';

import { BtnContain } from '../../components/Atoms/Button';
import metrics from '../../constants/layout';
import TextinputwithIcon from '../../components/Molecules/TextInputWithIcon';
import colors from '../../constants/colors';
import { Title } from '../../components/Atoms/Typography';

import LungXinstance from '../../api/server';


export default function ForgotPasswordEmailScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState('');

  const [password, setpassword] = useState('');

  const handleEmail = (text) => {
    setemail(text);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Forgot Password',
      headerTitleStyle: {
        color: colors.red,
        fontSize: 20,
      },
      headerTintColor: colors.green,
      headerLeft: () => (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: 30,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcons name="arrow-back" size={25} color={colors.black} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleSendTokenToEmail = async () => {
    setloading(true);
    if (email === '') {
      Alert.alert('Please enter email');
      setloading(false);
      return;
    }
    try {
      const response = await LungXinstance.post('api/password_reset/', {
        email: email,
      });
      // console.log(response.data);
      if (response.data.status === 'OK') {
        ToastAndroid.show('Token sent to your email', ToastAndroid.LONG);
        navigation.navigate('Forgot Password Token');
      }
      setloading(false);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.email[0] === 'Enter a valid email address.') {
        Alert.alert('Please enter a valid email address');
      } else {
        Alert.alert('Email not found in our database');
      }
      setloading(false);
    }
  };

  return (
    <View style={styles.container}>
        {/* {
            loading ? <LoadingScreen /> : null 
        } */}
      <View style={{width: metrics.screenWidth * 0.9, marginVertical: 20}}>
        <Title color={colors.black}>
          Please Enter Your Mail here to receive the token for resetting your
          Password
        </Title>
      </View>
      <TextinputwithIcon
        label="Email"
        placeholder="Enter email"
        iconName="at"
        onChangeText={handleEmail}
      />

      <View
        style={{
          width: metrics.screenWidth * 0.5,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginBottom: 30,
        }}>
        <BtnContain
          label="Receive Token"
          color={colors.green}
          onPress={handleSendTokenToEmail}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  Textlabels: {
    color: '#FFF',
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    marginVertical: 5,
  },
  dropdown: {
    height: 50,
    width: metrics.screenWidth * 0.92,
    backgroundColor: '#303858',
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  bottom: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
});
