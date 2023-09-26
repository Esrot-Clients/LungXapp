import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React, { useContext, useState, useEffect ,useId } from "react";
import Textinput from "../components/Atoms/Textinput";
import metrics from "../constants/layout";



import { SubTitle, Title } from "../components/Atoms/Typography";
import fonts from "../constants/fontsSize";
import colors from "../constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import SymptomsCard from '../components/Molecules/SymptomsCard';

import DropdownComponent from "../components/Molecules/Dropdown";
import * as Button from "../components/Atoms/Button";
import Checkbox from "expo-checkbox";
import { useIsFocused } from '@react-navigation/native';


//api
import LungXinstance from "../api/server";
import { AuthContext } from "../context/AuthContext";
import { AddPatientContext } from "../context/AddPatientContext";
import { RadioButton } from "react-native-paper";

const data = [
  { label: "Out-patient", value: "Out-patient" },
  { label: "In-patient", value: "In-patient" },
];

export default function AddPatientScreen({ route, navigation }) {

  const randomPatientID=useId(10)
  const { user } = useContext(AuthContext);
  const screenType = route?.params?.params?.screenType;
  const existedPatientId = route?.params?.existedPatientId;
  const {
    patientstatus,
    setpatientstatus,
    patientname,
    setpatientname,
    patientid,
    setpatientid,
    patientAge,
    setpatientAge,
    patientGender,
    setpatientGender,
    patientWeight,
    setpatientWeight,
    patientTemperture,
    setpatientTemperature,
    patientOxygenLevel,
    setpatientPatientOxygenLevel,
    patientBloodPressure,
    setpatientBloodPressure,
    ChiefSymptomsData,
    ChronicSymptomsData,
    LifeStyleHabits,
    additionalNotes,
    setaddtionalNotes,
    handleChiefSymptomsQuestionSelect,
    handleChronicSymptomsQuestionSelect,
    handleLifeStyleHabitsQuestionSelect,
    handleChiefOptionSelect,
    handleChronicOptionSelect,
    handleLifeStyleHabitsOptionSelect,
    handleFilteringofForm,  
     newlyCreatedPatientId,
    setNewlyCreatedPatientId,
    newlyCreatedPatientMoreDetailId,
    setNewlyCreatedPatientMoreDetailId
    
  } = useContext(AddPatientContext);

  useEffect(() => {
    navigation.setOptions(
      {
        headerTitle: "Add Patient",
        headerTitleStyle: {
          color: colors.red,
          fontFamily: "Montserrat-Medium",
          fontSize: 20,
        },

        headerTintColor: colors.red,
        headerLeft: () => (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginRight: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <MaterialIcons name="arrow-back" size={25} color={colors.black} />
            </TouchableOpacity>
          </View>
        ),
      },
      [navigation]
    );
  });
  const isFocused=useIsFocused()

  useEffect(()=>{
    setpatientid(Math.floor(Math.random()*100000000))
  },[isFocused])

  const [loading, setloading] = useState(false);

  const handleFirstDropdown = (value) => {
    console.log("value--------------------------------");
    // console.log(value);
    setpatientstatus(value);
  };

  const handleGenderSelection = (genderID) => {
    console.log("genderID-----------------------");
    // console.log(genderID);
    const UpdatedDataSelecton = patientGender.map((item) => {
      if (genderID === item.id) {
        return { ...item, isChecked: !item.isChecked };
      } else {
        return { ...item, isChecked: false };
      }
    });
    setpatientGender(UpdatedDataSelecton);
  };

  const handleTextChange = (newText) => {
    setaddtionalNotes(newText);
  };

  // send patient basic detail to serve before start recording 

  const handlePatientDetailSubmission = async (edit) => {
    console.log("-----------")
    const filterGenderArray = patientGender.filter(
      item => item.isChecked === true,
    );
    const filterChiefSymptomsArray = ChiefSymptomsData.filter(
      item => item.isChecked === true,
    );
    const filterChronicSymptomsArray = ChronicSymptomsData.filter(
      item => item.isChecked === true,
    );
    const filterLifeStyleHabitsArray = LifeStyleHabits.filter(
      item => item.isChecked === true,
    )
    const payload={
      doctor_id: user?.id,
      patient_name: patientname,
      out_patient: patientstatus === 'Out-patient' ? true : false,
      in_patient: patientstatus === 'In-patient' ? true : false,
      age: patientAge,
      patient_code:patientid,
      gender: filterGenderArray?.[0]?.gender,
      temperature: patientTemperture,
      oxygen_saturation: patientOxygenLevel,
      blood_pressure: patientBloodPressure,
      weight: patientWeight,
      chief_complaints: JSON.stringify(filterChiefSymptomsArray),
      chronic_diseases: JSON.stringify(filterChronicSymptomsArray),
      lifestyle_habits: JSON.stringify(filterLifeStyleHabitsArray),
      additional_notes: additionalNotes,      
    }

    try {
      setloading(true)

      if(newlyCreatedPatientId || newlyCreatedPatientMoreDetailId ){
        if(newlyCreatedPatientMoreDetailId){
          payload.patient_health_id=newlyCreatedPatientMoreDetailId
          const response = await LungXinstance.patch(`api/patients/`, payload,{
            headers:{
              "Content-Type": "multipart/form-data" 
            }
          });
          // setNewlyCreatedPatientId(response?.data?.patient_health_data?.patient)
        }
        if(newlyCreatedPatientId){
          payload.patient_id=newlyCreatedPatientId
          const response = await LungXinstance.patch(`api/patients/`, payload,{
            headers:{
              "Content-Type": "multipart/form-data" 
            }
          });
          // setNewlyCreatedPatientId(response?.data?.patient_health_data?.patient)
        }
        if(existedPatientId){
          navigation.goBack()
        }else{
          navigation.navigate("Anterior Recording");
        }

        
      }else{
        const response = await LungXinstance.put(`api/patients/`, payload,{
          headers:{
            "Content-Type": "multipart/form-data" 
          }
        });
        setNewlyCreatedPatientId(response?.data?.patient_health_data?.patient)
        setNewlyCreatedPatientMoreDetailId(response?.data?.patient_health_data?.id)
        navigation.navigate("Anterior Recording");
      }




      setloading(false)
    } catch (err) {
      setloading(false)
      Alert.alert('Message', 'Error Occurred');
      console.log(err);
    }
  };

  const PatientGenderCard = () => (
    <View style={{ marginVertical: 10 }}>
      <Title color={colors.black} size={fonts.font12}>
        Gender
      </Title>
      <View
        style={[
          styles.PatientSelectionContainer,
          { width: metrics.screenWidth * 0.43 },
        ]}
      >
        {patientGender.map((item,index) => (
          <View
          key={(()=>Math.random())()}
            style={[{ alignItems: "center", flexDirection: "row"  },index==0?{paddingRight:20}:{}]}
          >
            <RadioButton.Android
              tintColors={{ true: colors.green, false: "black" }}
              onPress={() => handleGenderSelection(item.id)}
              status={item.isChecked? 'checked' : 'unchecked'}
            />
            {/* <View style={{ width: 5 }} /> */}
            <SubTitle size={fonts.font12}>{item.gender}</SubTitle>
          </View>
        ))}
      </View>
    </View>
  );





  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* {
        loading ? <LoadingScreen /> : null 
      } */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ marginHorizontal: 10 }}>
          <Title color={colors.black} size={fonts.font12}>
           Choose Patient Status :
          </Title>
        </View>
        <DropdownComponent
          dropdowndata={data}
          width={metrics.screenWidth / 2.5}
          onDropdownChange={handleFirstDropdown}
          placeholder="Status"
          value={patientstatus}
        />
      </View>

      <Textinput
        label={"Patient name"}
        onChangeText={setpatientname}
        value={patientname}
      />

      <Textinput
        label={"Patient ID"}
        onChangeText={setpatientid}
        value={patientid+""}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: metrics.screenWidth * 0.9,
        }}
      >
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Age"
          onChangeText={setpatientAge}
          value={patientAge}
        />
        <PatientGenderCard />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: metrics.screenWidth * 0.9,
        }}
      >
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Weight(kg)"
          onChangeText={setpatientWeight}
          value={patientWeight}
        />
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Temperature(C)"
          onChangeText={setpatientTemperature}
          value={patientTemperture}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: metrics.screenWidth * 0.9,
        }}
      >
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Oxygen saturation(SpO2)"
          onChangeText={setpatientPatientOxygenLevel}
          value={patientOxygenLevel}
        />
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Blood Pressure(mm/hg)"
          onChangeText={setpatientBloodPressure}
          value={patientBloodPressure}
        />
      </View>

      {/* Multiple Selection form  */}

      <View style={{ width: metrics.screenWidth * 0.9 }}>
        <Title color={colors.green}>Tick all Symptoms that apply</Title>
      </View>
      {/* Chief Complaints start */}

      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Chief Complaints</Title>
      </View>

      {ChiefSymptomsData.map((questionitem, index) => (
        <>
          <View key={(()=>Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked? 'checked' : 'unchecked'}
                  onPress={() =>
                    handleChiefSymptomsQuestionSelect(questionitem.id)
                  }
                />
              </View>
            </View>

            {questionitem.isChecked === true ? (
              <View style={styles.optionsCard}>
                <View style={{ paddingLeft: 20 }}>
                  <SubTitle size={fonts.font12}>Since how long ?</SubTitle>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {questionitem.options.map((options) => (
                    <View
                      key={(()=>Math.random())()}
                      style={{
                        width: "50%",
                        alignItems: "flex-start",
                        paddingLeft: 20,
                        paddingVertical: 5,
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <RadioButton.Android
                          label="yes"
                          status={options.isChecked? 'checked' : 'unchecked'}
                          tintColors={{ true: colors.green, false: "black" }}
                          onPress={() =>
                            handleChiefOptionSelect(options.id, index)
                          }
                        />
                        <View style={{ width: 10 }} />
                        <SubTitle size={fonts.font10}>{options.title}</SubTitle>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </>
      ))}
      {/* Chief Complaints end */}


      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Chronic Disease</Title>
      </View>

      {ChronicSymptomsData.map((questionitem, index) => (
        <>
          <View key={(()=>Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked? 'checked' : 'unchecked'}
                  onPress={() =>
                    handleChronicSymptomsQuestionSelect(questionitem.id)
                  }
                />
              </View>
            </View>

            {questionitem.isChecked === true ? (
              <View style={styles.optionsCard}>
                <View style={{ paddingLeft: 20 }}>
                  <SubTitle size={fonts.font12}>Since how long ?</SubTitle>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {questionitem.options.map((options) => (
                    <View
                    key={(()=>Math.random())()}
                      style={{
                        width: "50%",
                        alignItems: "flex-start",
                        paddingLeft: 20,
                        paddingVertical: 5,
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <RadioButton.Android
                          status={options.isChecked? 'checked' : 'unchecked'}
                          tintColors={{ true: colors.green, false: "black" }}
                          onPress={() =>
                            handleChronicOptionSelect(options.id, index)
                          }
                        />
                        <View style={{ width: 10 }} />
                        <SubTitle size={fonts.font10}>{options.title}</SubTitle>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </>
      ))}

      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Lifestyle habits</Title>
      </View>

      {LifeStyleHabits.map((questionitem, index) => (
        <>
          <View key={(()=>Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked? 'checked' : 'unchecked'}
                  onPress={() =>
                    handleLifeStyleHabitsQuestionSelect(questionitem.id)
                  }
                />
              </View>
            </View>

            {questionitem.isChecked === true ? (
              <View style={styles.optionsCard}>
                <View style={{ paddingLeft: 20 }}>
                  <SubTitle size={fonts.font12}>Since how long ?</SubTitle>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {questionitem.options.map((options) => (
                    <View
                    key={(()=>Math.random())()}
                      style={{
                        width: "50%",
                        alignItems: "flex-start",
                        paddingLeft: 20,
                        paddingVertical: 5,
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <RadioButton.Android
                          status={options.isChecked? 'checked' : 'unchecked'}
                          tintColors={{ true: colors.green, false: "black" }}
                          onPress={() =>
                            handleLifeStyleHabitsOptionSelect(options.id, index)
                          }
                        />
                        <View style={{ width: 10 }} />
                        <SubTitle size={fonts.font10}>{options.title}</SubTitle>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </>
      ))}

      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Additional Notes </Title>
      </View>

      <Textinput
        onChangeText={handleTextChange}
        multiline={true}
        height={150}
        value={additionalNotes}
      />

      <View style={{ marginBottom: 40, alignItems: "center" }}>
        {screenType === "Entry Point" ? (
          <View style={{ width: metrics.screenWidth * 0.5 }}>
            <Button.BtnContain
              label="Start Recording"
              color={colors.green}
              onPress={() => {
                  handlePatientDetailSubmission(false);
                  handleFilteringofForm();
              }}
            />
          </View>
        ) : (
          <View style={{ width: metrics.screenWidth * 0.5 }}>
            <Button.BtnContain
              label="Edit Details"
              color={colors.green}
              onPress={() => {
                handleFilteringofForm();
                handlePatientDetailSubmission(true);
               
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 15,
  },
  SymptomsCard: {
    flexDirection: "row",
    width: metrics.screenWidth * 0.9,
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.green,
  },
  optionsCard: {
    width: metrics.screenWidth * 0.9,
    padding: 10,
  },
  PatientSelectionContainer: {
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingRight:20,
    alignItems: "center",
    justifyContent: "space-evenly",
    fontSize: fonts.font12,
    color: colors.black,
    flexDirection: "row",
  },
});


