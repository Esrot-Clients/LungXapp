import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Title } from '@joaosousa/react-native-progress-steps';
import React, { useEffect,useContext } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import metrics from '../constants/layout';
import colors from '../constants/colors';
import fonts from '../constants/fontsSize';
import { AddPatientContext } from '../context/AddPatientContext';

export default function HomePrimaryScreen({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTitleStyle: {
        color: "#000",
        fontFamily: "Montserrat-Medium",
        fontSize: 20,
      },
      headerTintColor: "#000",

      // headerLeft: () => (
      //   <View
      //     style={{
      //       alignItems: "center",
      //       flexDirection: "row",
      //       marginLeft: 15,
      //     }}
      //   >
      //     <TouchableOpacity>
      //       <MaterialCommunityIcons
      //         name="arrow-left"
      //         size={25}
      //         color={colors.green}
      //       />
      //     </TouchableOpacity>
      //   </View>
      // ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginRight: 20,
            }}
          >
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="bell-outline"
                size={25}
                color={"#000"}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={25}
                color={"#000"}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const {resetStateObj} = useContext(AddPatientContext);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.IconContainer}
        activeOpacity={0.8}
        onPress={async() =>{
          // await resetStateObj()
          navigation.navigate("Add Patient", {
            screen: "Add Patient",
            params: {
              screenType: "Entry Point",
            },
          })
        }
        }
      >
        <MaterialCommunityIcons
          name="plus-circle-outline"
          color={colors.green}
          size={metrics.screenWidth * 0.5}
        />
        <Title size={fonts.font20} color={colors.green}>
          ADD PATIENT
        </Title>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    IconContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: metrics.screenWidth * 0.85,
      backgroundColor: colors.faintgray,
      borderRadius: 10,
      marginHorizontal: 20,
      paddingVertical: 30,
    },
  });