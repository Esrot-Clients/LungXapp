import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BtnContain } from '../../components/Atoms/Button';
import metrics from '../../constants/layout';
import { AuthContext } from '../../context/AuthContext';
import TextinputwithIcon from '../../components/Molecules/TextInputWithIcon';
import colors from '../../constants/colors';
import { Title } from '../../components/Atoms/Typography';

import LungXinstance from '../../api/server';
import LoadingScreen from '../../components/Atoms/LoadingScreen';
export default function ForgotPasswordTokenScreen({navigation}) {
  const [loading, setloading] = useState(false);
  const [tokenID, settokenID] = useState('');
  const [password, setpassword] = useState('');

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
  const handletoken = (text) => {
    settokenID(text);
  };

  const handlePassword = (text) => {
    setpassword(text);
  };

  const handlesendTokenandPassword = async () => {
    setloading(true);
    if (tokenID === '' || password === '') {
      Alert.alert('Please enter details correctly');
      setloading(false);
      return;
    }
    try {
      const response = await LungXinstance.post('api/password_reset/confirm/', {
        password: password,
        token: tokenID,
      });
      // console.log(response.data);
      if (response.data.status === 'OK') {
        ToastAndroid.show(
          'Password Updated please login to continue',
          ToastAndroid.SHORT,
        );
        navigation.navigate('Login');
      }
      setloading(false);
    } catch (error) {
      console.log(error.response.data);
      if (error.response.data.password[0]) {
        Alert.alert(error.response.data.password[0]);
        setloading(false);
        return;
      }
      if (error.response.data.detail) {
        Alert.alert(error.response.data.detail);
        setloading(false);
        return;
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? <LoadingScreen /> : null}
      <View style={{paddingHorizontal: 10, marginVertical: 20}}>
        <Title color={colors.black}>
          Please Enter Your token received on mail and new Password for resetting your
          Password
        </Title>
      </View>
      <TextinputwithIcon
        label="Enter Token"
        placeholder="enter token received on email"
        iconName="at"
        onChangeText={handletoken}
      />

      <TextinputwithIcon
        label="Enter Password"
        placeholder="enter new password"
        iconName="eye"
        onChangeText={handlePassword}
        onSubmitEditing={handlesendTokenandPassword}
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
          onPress={handlesendTokenandPassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
