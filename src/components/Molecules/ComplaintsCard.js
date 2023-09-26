import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import colors from "../../constants/colors";
import fonts from "../../constants/fontsSize";
import metrics from "../../constants/layout";
import { Title } from "../Atoms/Typography";

import { useNavigation } from "@react-navigation/native";
import Textinput from "../Atoms/Textinput";

export default function ComplaintsCard({
  edit,
  chiefComplaints,
  chronicDisease,
  lifeStyle,
}) {
  const navigation = useNavigation();
 
  return (
    <View style={styles.symptomsDetailsContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title color={colors.black} size={fonts.font12}>
          Complaints
        </Title>
        {edit === true ? (
          <TouchableOpacity onPress={() => navigation.push("Add Patient", {
            screenTypeEdit : 'Edit Point'
          })}>
            <View
              style={{
                backgroundColor: colors.green,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Montserrat-Medium", color: "#fff" }}>
                Edit
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      {chiefComplaints?.length > 0 && (
        <View>
          <View style={{ marginTop: 15 }}>
            <Title color={colors.black} size={fonts.font12}>
              Chief Complaints
            </Title>
          </View>

          {chiefComplaints.map((item, index) => (
            <View key={(()=>Math.random())()} style={styles.symptomsDetails}>
              <View style={{ flex: 0.35 }}>
                <Title color={colors.black} size={fonts.font10}>
                  {item.title}
                </Title>
              </View>
              <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                  Since :
                </Title>
              </View>
              <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                {
                    item?.options?item?.options.map(ele=>{
                      if(ele?.isChecked){
                        return ele?.title
                      }
                    }):item?.option
                  }
                </Title>
              </View>
            </View>
          ))}
        </View>
      )}

      {chronicDisease?.length > 0 && (
        <View>
          <View style={{ marginTop: 15 }}>
            <Title color={colors.black} size={fonts.font12}>Chronic Disease</Title>
          </View>

          {chronicDisease.map((item, index) => (
            <View key={(()=>Math.random())()} style={styles.symptomsDetails}>
              <View style={{ flex: 0.33 }}>
                <Title color={colors.black} size={fonts.font10}>
                  {item.title}
                </Title>
              </View>
              <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                  Since :
                </Title>
              </View>
              <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                  {
                    item?.options?item?.options.map(ele=>{
                      if(ele?.isChecked){
                        return ele?.title
                      }
                    }):item?.option
                  }
                </Title>
              </View>
            </View>
          ))}
        </View>
      )}

      {lifeStyle?.length > 0 && (
        <View>
          <View style={{ marginTop: 15}}>
            <Title color={colors.black} size={fonts.font12}>Lifestyle Habits</Title>
          </View>

          {lifeStyle.map((item, index) => (
            <View key={(()=>Math.random())()} style={styles.symptomsDetails}>
              <View style={{ flex: 0.33 }}>
                <Title color={colors.black} size={fonts.font10}>
                  {item.title}
                </Title>
              </View>
              <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                  Since :
                </Title>
              </View>
              <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                <Title color={colors.black} size={fonts.font10}>
                {
                    item?.options?item?.options.map(ele=>{
                      if(ele?.isChecked){
                        return ele?.title
                      }
                    }):item?.option
                  }
                </Title>
              </View>
            </View>
          ))}
        </View>
      )}




    </View>
  );
}

const styles = StyleSheet.create({
  symptomsDetailsContainer: {
    width: metrics.screenWidth * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    padding: 20,
    marginVertical: 10,
  },
  symptomsDetails: {
    display: "flex",
    flexDirection: "row",
    width: metrics.screenWidth * 0.8,
    marginVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    padding: 10,
  },
});
