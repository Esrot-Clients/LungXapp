import { ScrollView, StyleSheet, View, TouchableOpacity, Text, Alert, ToastAndroid } from "react-native";
import React, { useContext, useState, useEffect, useId } from "react";
import Textinput from "../components/Atoms/Textinput";
import metrics from "../constants/layout";

import { SubTitle, Title } from "../components/Atoms/Typography";
import fonts from "../constants/fontsSize";
import colors from "../constants/colors";
import { Audio } from "expo-av";

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
import LoadingScreen from "../components/Atoms/LoadingScreen";

const data = [
  { label: "Out-patient", value: "Out-patient" },
  { label: "In-patient", value: "In-patient" },
];

export default function AddPatientScreen({ route, navigation }) {

  const randomPatientID = useId(10)
  const { user } = useContext(AuthContext);
  const screenType = route?.params?.params?.screenType;
  const screenTypeEdit = route?.params?.screenTypeEdit;
  const existedPatientId = route?.params?.existedPatientId;
  const existedPatientHealthId = route?.params?.existedPatientHealthId;
  const session = route?.params?.session;
  const existedSessionCreatedData = route?.params?.existedSessionCreatedData;

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
    setNewlyCreatedPatientMoreDetailId,
    setSessionNo,
    setChiefSymptomsData,
    setChronicSymptomsData,
    setLifeStyleHabits,
    diagonsisNotes,
    setDiagonsisNotes,
    setNewlyCreatedPatientLungsId,
    recordingsPosterior,
    recordings,
    AnteriorTagging,
    PosteriorTagging
  } = useContext(AddPatientContext);

  useEffect(() => {
    navigation.setOptions(
      {
        headerTitle: "Add Patient Details",
        headerTitleStyle: {
          color: colors.red,
          fontFamily: "Montserrat-Medium",
          fontSize: 18,
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
  const isFocused = useIsFocused()


  useEffect(() => {
    setpatientid(Math.floor(Math.random() * 100000000))
    getOldSession()
  }, [session, existedPatientId, isFocused])

  const getOldSession = async () => {
    setloading(true)
    const payload = {
      id: existedPatientId,
      doctor_id: user.id
    }
    // console.log("payload=------of geting old values done sent-------------")
    if (!existedPatientId) {
      setloading(false)
      return null
    }
    else {
      try {
        const res = await LungXinstance.post("/api/patients/", payload, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        setpatientname(res.data?.[0]?.patient_name)
        setpatientAge(res.data?.[0]?.patienthealthdata?.[0]?.age)
        setpatientGender(
          [
            {
              gender: "male",
              isChecked: (() => res.data?.[0]?.patienthealthdata?.[0]?.gender == "male")(),
              id: 1,
            },
            {
              gender: "female",
              isChecked: (() => res.data?.[0]?.patienthealthdata?.[0]?.gender == "female")(),
              id: 2,
            },
          ]
        )
        setpatientstatus((() => res.data?.[0]?.in_patient ? "In-patient" : "Out-patient")())
        setpatientWeight(res.data?.[0]?.patienthealthdata?.[0]?.weight)
        setpatientTemperature(res.data?.[0]?.patienthealthdata?.[0]?.temperature)
        setpatientPatientOxygenLevel(res.data?.[0]?.patienthealthdata?.[0]?.oxygen_saturation)
        setpatientBloodPressure(res.data?.[0]?.patienthealthdata?.[0]?.blood_pressure)
        setaddtionalNotes(res.data?.[0]?.patienthealthdata?.[0]?.additional_notes)
        setpatientid(res.data?.[0]?.patient_code)
        setDiagonsisNotes(res.data?.[0]?.patienthealthdata?.[0]?.diagnosis_notes)
        res.data?.[0]?.patienthealthdata?.[0]?.chief_complaints.length > 0 && setChiefSymptomsData(JSON.parse(res.data?.[0]?.patienthealthdata?.[0]?.chief_complaints))
        res.data?.[0]?.patienthealthdata?.[0]?.chronic_diseases.length > 0 && setChronicSymptomsData(JSON.parse(res.data?.[0]?.patienthealthdata?.[0]?.chronic_diseases))
        res.data?.[0]?.patienthealthdata?.[0]?.lifestyle_habits.length > 0 && setLifeStyleHabits(JSON.parse(res.data?.[0]?.patienthealthdata?.[0]?.lifestyle_habits))
        setloading(false)

      } catch (e) {
        setloading(false)
        console.log("getOldSession.......error", e)
      }
    }
  }

  const [loading, setloading] = useState(false);

  const handleFirstDropdown = (value) => {
    setpatientstatus(value);
  };

  const handleGenderSelection = (genderID) => {
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
  const handleDiaganosisTextChange = (newText) => {
    setDiagonsisNotes(newText)
  };

  // send patient basic detail to serve before start recording 

  const handlePatientDetailSubmission = async (edit) => {
    const filterGenderArray = patientGender.filter(
      item => item.isChecked === true,
    );

    if (patientstatus == "") {
      ToastAndroid.showWithGravityAndOffset(
        'Patient Status is required!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } else if (patientname == "") {
      ToastAndroid.showWithGravityAndOffset(
        'Patient Name is required!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }  else {
      const payload = {
        doctor_id: user?.id,
        patient_name: patientname,
        out_patient: patientstatus === 'Out-patient' ? true : false,
        in_patient: patientstatus === 'In-patient' ? true : false,
        age: patientAge,
        patient_code: patientid,
        gender: filterGenderArray?.[0]?.gender,
        temperature: patientTemperture,
        oxygen_saturation: patientOxygenLevel,
        blood_pressure: patientBloodPressure,
        weight: patientWeight,
        // chief_complaints: JSON.stringify(filterChiefSymptomsArray),
        // chronic_diseases: JSON.stringify(filterChronicSymptomsArray),
        // lifestyle_habits: JSON.stringify(filterLifeStyleHabitsArray),
        chief_complaints: JSON.stringify(ChiefSymptomsData),
        chronic_diseases: JSON.stringify(ChronicSymptomsData),
        lifestyle_habits: JSON.stringify(LifeStyleHabits),
        additional_notes: additionalNotes,
        diagnosis_notes: diagonsisNotes,
      }

      try {
        setloading(true)

        if (existedPatientId && existedPatientHealthId) {
          const payload = {
            age: patientAge,
            gender: filterGenderArray?.[0]?.gender,
            temperature: patientTemperture,
            oxygen_saturation: patientOxygenLevel,
            blood_pressure: patientBloodPressure,
            weight: patientWeight,
            additional_notes: additionalNotes,
            diagnosis_notes: diagonsisNotes,
            chief_complaints: JSON.stringify(ChiefSymptomsData),
            chronic_diseases: JSON.stringify(ChronicSymptomsData),
            lifestyle_habits: JSON.stringify(LifeStyleHabits),
            id: existedPatientId,
            patient_health_id: existedPatientHealthId
          }
          await getPatientLungsDetail(existedPatientId)

          const response = await LungXinstance.patch("api/patients/", payload, {
            headers: {
              'content-type': 'multipart/form-data'
            }
          })
          setloading(false)
          setNewlyCreatedPatientId(response?.data?.patient)
          setNewlyCreatedPatientMoreDetailId(response?.data?.id)
          await getPatientLungsDetail(response?.data?.patient)
          navigation.navigate("Anterior Recording");
        }
        else if (existedPatientId && !newlyCreatedPatientMoreDetailId && !newlyCreatedPatientId) {
          console.log("addded session--------------------")
          const payload = {
            age: patientAge,
            gender: filterGenderArray?.[0]?.gender,
            temperature: patientTemperture,
            oxygen_saturation: patientOxygenLevel,
            blood_pressure: patientBloodPressure,
            weight: patientWeight,
            additional_notes: additionalNotes,
            diagnosis_notes: diagonsisNotes,
            session: "session " + (1 + Number(session)),
            chief_complaints: JSON.stringify(ChiefSymptomsData),
            chronic_diseases: JSON.stringify(ChronicSymptomsData),
            lifestyle_habits: JSON.stringify(LifeStyleHabits),
            id: existedPatientId
          }
          // console.log("ADD Patients data.......")
          const response = await LungXinstance.put(`api/patients/`, payload, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          setloading(false)
          console.log("sessin addedd success---------------")

          setNewlyCreatedPatientId(response?.data?.patient_health_data?.[response?.data?.patient_health_data?.length - 1]?.patient)
          setNewlyCreatedPatientMoreDetailId(response?.data?.patient_health_data?.[response?.data?.patient_health_data?.length - 1].id)
          navigation.navigate("Anterior Recording");
          setSessionNo(1 + Number(session))
        }
        else if (newlyCreatedPatientId || newlyCreatedPatientMoreDetailId) {
          console.log("patch both tables-------------------- ")
          if (newlyCreatedPatientMoreDetailId) {
            payload.patient_health_id = newlyCreatedPatientMoreDetailId
            const response = await LungXinstance.patch(`api/patients/`, payload, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            if (screenTypeEdit === "Edit Point") {
              setloading(false)
              navigation.navigate("Overall Report");
            } else {
              setloading(false)
              navigation.navigate("Anterior Recording");
            }

          }
          if (newlyCreatedPatientId) {
            payload.patient_id = newlyCreatedPatientId
            const response = await LungXinstance.patch(`api/patients/`, payload, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });

            if (screenTypeEdit === "Edit Point") {
              setloading(false)
              navigation.navigate("Overall Report");
            } else {
              setloading(false)
              navigation.navigate("Anterior Recording");
            }
          }
        }
        else {
          // console.log("addded new patient--------------------")
          const response = await LungXinstance.put(`api/patients/`, payload, {
            headers: {
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
    }
  };

  const [anteriorTagPositions, setanteriorTagPositions] = useState([
    {
      id: 1,
      lungs_tags: "p0_tag",

    },
    {
      id: 2,
      lungs_tags: "p1_tag",
    },
    {
      id: 3,
      lungs_tags: "p2_tag",

    },
    {
      id: 4,
      lungs_tags: "p3_tag",

    },
    {
      id: 5,
      lungs_tags: "p4_tag",

    },
    {
      id: 6,
      lungs_tags: "p5_tag",

    },
    {
      id: 7,
      lungs_tags: "p6_tag",
    },
  ]);

  const [posteriorTagPositions, setposteriorTagPositions] = useState([
    {
      id: 1,
      lungs_tags: "p7_tag",

    },
    {
      id: 2,
      lungs_tags: "p8_tag",
    },
    {
      id: 3,
      lungs_tags: "p9_tag",

    },
    {
      id: 4,
      lungs_tags: "p10_tag",

    },
    {
      id: 5,
      lungs_tags: "p11_tag",

    },
    {
      id: 6,
      lungs_tags: "p12_tag",

    }
  ]);

  const getPatientLungsDetail = async (pid) => {
    try {
      var res = await LungXinstance.post(`api/lung_audio/`, { doctor_id: user?.id, patient_id: pid }, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if (res?.data?.length > 0) {
        var Data = {};
        if (session) {
          var newDatafilter = res?.data?.filter(item => item.session === session && item.created_at.slice(0, 10) == existedSessionCreatedData.slice(0, 10));
          Data = newDatafilter?.[0]
          var parts = session.split(" ");
          setSessionNo(parseInt(parts[1]))
         
        } else {
          Data = res?.data?.[0]
        } 

        setNewlyCreatedPatientLungsId(Data?.id)
        
        recordings.forEach(async (recordingss, index) => {
          if (Data?.[recordingss.key] != null) {
            const uri = `https://lung.thedelvierypointe.com${Data?.[recordingss.key]}`
            // const { sound } = await Audio.Sound.createAsync({ uri: uri });
            recordingss.sound = "sound";
            recordingss.file = uri;
          }
        });

        recordingsPosterior.forEach(async (recordingss, index) => {
          if (Data?.[recordingss.key] != null) {
            const uri = `https://lung.thedelvierypointe.com${Data?.[recordingss.key]}`
            // const { sound } = await Audio.Sound.createAsync({ uri: uri });
            recordingss.sound = "sound";
            recordingss.file = uri;
          }
        });

        anteriorTagPositions.map((recordingLine, index) => {
          Data?.[recordingLine.lungs_tags] && JSON.parse(Data?.[recordingLine?.lungs_tags])?.options?.map(opt => {
            AnteriorTagging.map((antag) => {
              antag?.id === recordingLine?.id &&
                antag?.options?.map((option) => {
                  if (option?.id === opt?.id && opt?.id != 5 && opt?.id != 6) {
                    option.isChecked = true;
                  }
                })
            })
          }
          )
        })

        posteriorTagPositions.map((recordingLine, index) => {
          Data?.[recordingLine.lungs_tags] && JSON.parse(Data?.[recordingLine?.lungs_tags])?.options?.map(opt => {
            PosteriorTagging.map((postag) => {
              postag?.id === recordingLine?.id &&
                postag?.options?.map((option) => {
                  if (option?.id === opt?.id && opt?.id != 5 && opt?.id != 6) {
                    option.isChecked = true;
                  }
                })
            })
          }
          )
        })

      }
    } catch (e) {
      console.log("Error...in getPatientLungsDetail...recording...", e)
    }
  }


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
        {patientGender.map((item, index) => (
          <View
            key={(() => Math.random())()}
            style={[{ alignItems: "center", flexDirection: "row" }, index == 0 ? { paddingRight: 20 } : {}]}
          >
            <RadioButton.Android
              tintColors={{ true: colors.green, false: "black" }}
              onPress={() => handleGenderSelection(item.id)}
              status={item.isChecked ? 'checked' : 'unchecked'}
            />
            {/* <View style={{ width: 5 }} /> */}
            <SubTitle size={fonts.font12}>{item.gender}</SubTitle>
          </View>
        ))}
      </View>
    </View>
  );



  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {
        loading ? <LoadingScreen /> : null
      }
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
        label={"Patient Name"}
        onChangeText={setpatientname}
        value={patientname}
        autoCapitalize="characters"
      />

      <Textinput
        label={"Patient ID"}
        onChangeText={setpatientid}
        value={patientid + ""}
        editable={false}
      />
      
      <View
        style={{
          display:"flex",
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
          keyboardType="numeric"
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
          keyboardType="numeric"
        />
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Temperature(C)"
          onChangeText={setpatientTemperature}
          value={patientTemperture}
          keyboardType="numeric"
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
          keyboardType="numeric"
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
          <View key={(() => Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked ? 'checked' : 'unchecked'}
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
                      key={(() => Math.random())()}
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
                          status={options.isChecked ? 'checked' : 'unchecked'}
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
          <View key={(() => Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked ? 'checked' : 'unchecked'}
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
                      key={(() => Math.random())()}
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
                          status={options.isChecked ? 'checked' : 'unchecked'}
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
          <View key={(() => Math.random())()} style={{ display: "flex", marginVertical: 10 }}>
            <View style={styles.SymptomsCard}>
              <View style={{ flex: 0.5 }}>
                <SubTitle size={fonts.font12}>{questionitem.title}</SubTitle>
              </View>
              <View style={{ flex: 0.5, alignItems: "flex-end" }}>
                <RadioButton.Android
                  label="Yes"
                  status={questionitem.isChecked ? 'checked' : 'unchecked'}
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
                      key={(() => Math.random())()}
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
                          status={options.isChecked ? 'checked' : 'unchecked'}
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
      {/* 
      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Diagnosis Notes </Title>
      </View>

      <Textinput
        onChangeText={handleDiaganosisTextChange}
        multiline={true}
        height={75}
        value={diagonsisNotes}
      /> */}

      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Additional Notes </Title>
      </View>

      <Textinput
        onChangeText={handleTextChange}
        multiline={true}
        height={75}
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
            {screenTypeEdit === "Edit Point" ?
              <Button.BtnContain
                label="Save"
                color={colors.green}
                onPress={() => {
                  handleFilteringofForm();
                  handlePatientDetailSubmission(true);

                }}
              />
              :
              <Button.BtnContain
                label="Edit Details"
                color={colors.green}
                onPress={() => {
                  handleFilteringofForm();
                  handlePatientDetailSubmission(true);

                }}
              />
            }
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
    paddingRight: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
    fontSize: fonts.font12,
    color: colors.black,
    flexDirection: "row",
  },
});


