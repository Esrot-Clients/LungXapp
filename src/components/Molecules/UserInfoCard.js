import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable, ToastAndroid } from 'react-native';
import metrics from '../../constants/layout';
import colors from '../../constants/colors';
import * as Typography from '../Atoms/Typography';
import fonts from '../../constants/fontsSize';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useMutation } from "react-query"
import profielApi from '../../api/profile';
import LungXinstance from '../../api/server';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const UserInfoCard = () => {

  const { user, setUser, } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(user?.profile_picture)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result?.cancelled) {
      const profile = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      try {
        const res = await LungXinstance.patch('api/user_profile/', {
          profile_picture: profile,
        });
        if (res?.data) {
          setProfileImage(res?.data?.profile_picture)
          setUser({
            ...user,
            profile_picture: res?.data?.profile_picture,
          })
          await AsyncStorage.mergeItem(
            'user',
            JSON.stringify({
              profile_picture: res?.data?.profile_picture,
            }),
          );
          ToastAndroid.show('Profile Picture Updated', ToastAndroid.LONG);

        }
      } catch (e) {
        console.log("Error.....In User Profile..", e)
      }


    }
  }



  return (
    <View style={styles.AvatarContainer}>
      <Pressable onPress={pickImage}>
        <View style={styles.iconImgView}>
          <View style={styles.addIconImg}>
            <MaterialIcons name="add" size={17} color={colors.green} />
          </View>
          {profileImage ?
            <Image
              style={styles.imgSize}
              source={{
                uri: 'https://lung.thedelvierypointe.com' + profileImage,
              }}
            />
            :
            <Image
              style={styles.imgSize}
              source={require("../../../assets/profile.jpg")}
            />
          }

        </View>
      </Pressable>
      <View style={styles.InfoContainer}>
        <Typography.Title size={fonts.font16} color={colors.red}>
          Basic Information
        </Typography.Title>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  AvatarContainer: {
    width: metrics.screenWidth,
    marginTop: 10,
    alignItems: 'center',
  },
  InfoContainer: {
    marginTop: 5,
  },
  iconImgView: {
    borderWidth: 1.5, borderColor: colors.green, borderRadius: 100, padding: 1
  },
  addIconImg: {
    position: "absolute", backgroundColor: "#F6FBF9", padding: 1, zIndex: 9999, borderRadius: 50, borderColor: colors.green, borderWidth: 1.5, bottom: 4, right: 7,width:24, height:24, alignItems:"center", justifyContent:"center"
  },
  imgSize: {
    width: 110, height: 110, borderRadius: 100,
  }
});

export default UserInfoCard;