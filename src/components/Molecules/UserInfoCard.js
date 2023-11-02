import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable } from 'react-native';
import metrics from '../../constants/layout';
import colors from '../../constants/colors';
import * as Typography from '../Atoms/Typography';
import fonts from '../../constants/fontsSize';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useMutation } from "react-query"
import profielApi from '../../api/profile';
import LungXinstance from '../../api/server';
import axios from 'axios';

const user = {
  firstname: 'Pratyush',
  lastname: 'Motha',
  username: 'pratyushmotha',
  email: 'ipratyushmotha@gmail.com',
  phone: '7668532731',
};

const UserInfoCard = ({ profile }) => {

  // const {mutation}=useMutation("/api/user_profile/",profielApi.patchProfile)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result?.cancelled) {
      // uri: Platform.OS === 'android' ? result.uri : result.uri.replace('file://', '')
      const profile = await FileSystem.readAsStringAsync(result.uri, { encoding: 'base64' });
      // await LungXinstance.patch("api/user_profile/",{profile_picture:profile})
      // console.log(profile)
      // await axios.patch("https://lung.thedelvierypointe.com/api/user_profile/", { profile_picture: profile }, {
      //   headers: {
      //     "Accept": "application/json, text/plain, */*",
      //     "Content-Type": "application/json",
      //     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1MTI4MTg0LCJpYXQiOjE2ODk1NzYxODQsImp0aSI6IjgwNjY5YTAwZWYzODQyZjQ4MWY2NjNlOWMwNGJmMzM2IiwidXNlcl9pZCI6MTJ9.mDsM2i6GK733g7XLCTghjIaipWPuPlbtIx9BzX8M2X4"
      //   },
      // }).then(res => console.log("profile_picture....",res)).catch(err => console.log(err))

      try {
        const response = await LungXinstance.patch('api/user_profile/', {
          profile_picture: profile,
        });
        console.log("response....picture..", response)
      } catch (e) {
        console.log("Error.....In User Profile..", e)
      }
      
      // mutation({profile_picture:profile})
      // UpdateProfile(profile, token)
      // .then((response) => {
      //     if (response?.status == 200) {
      //         dispatch(setUser(response.data.data))
      //         ToastAndroid.show("Profile Picture Updated Successfully", ToastAndroid.SHORT)
      //     }
      // })
      // .catch((error) => {
      // })
    }
  }



  return (
    <View style={styles.AvatarContainer}>
      <Pressable onPress={pickImage}>

        {profile ?
          <Image
            style={{ width: 100, height: 100, borderRadius: 100 ,borderWidth:1,borderColor:"#E0E0E0" }}
            source={{
              uri: 'https://lung.thedelvierypointe.com' + profile,
            }}
          />
          :
          <Image
            style={{ width: 100, height: 100,borderRadius: 100, borderWidth:1,borderColor:"#E0E0E0" }}
            source={require("../../../assets/profile.jpg")}
          />
        }
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
    marginTop: 20,
    alignItems: 'center',
  },
  InfoContainer: {
    marginTop: 5,
  },
});

export default UserInfoCard;