import { Image, Pressable, ScrollView, StyleSheet, Text, View, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";
import colors from "../constants/colors";
import * as Typography from "../components/Atoms/Typography";
import metrics from "../constants/layout";
import fonts from "../constants/fontsSize";
import ComplaintsCard from "../components/Molecules/ComplaintsCard";
import Textinput from "../components/Atoms/Textinput";
import { Audio } from 'expo-av';
import ProgressSteps, {
  Title,
  Content,
} from "@joaosousa/react-native-progress-steps";
//
import * as Button from "../components/Atoms/Button";

import Checkbox from "expo-checkbox";
import { AddPatientContext, lungs } from "../context/AddPatientContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { warningStyle } from "./PosteriorTagging";
import { Modal, RadioButton } from "react-native-paper";
import { useIsFocused } from '@react-navigation/native';
import LungXinstance from "../api/server";
import LoadingScreen from "../components/Atoms/LoadingScreen";
import ProgressStep from "../components/Molecules/ProgressStep";


export default function OverallReport({ navigation, route }) {


  const {
    patientname,
    patientid,
    patientstatus,
    patientAge,
    patientWeight,
    patientTemperture,
    patientOxygenLevel,
    patientBloodPressure,
    filteredChiefSymptoms,
    filteredChronicSymptoms,
    filteredLifeStyle,
    filteredAnteriorTags,
    filteredPosteriorTags,
    patientGender,
    handleClearAddPatientData,
    newlyCreatedPatientMoreDetailId,
    additionalNotes,
    diagonsisNotes,
    setDiagonsisNotes,
    recordings,
    recordingsPosterior
  } = useContext(AddPatientContext);
  const [currrentStep, setCurrentStep] = useState(4);
  const [showWarningPopup, setShowWarningPopup] = useState(false)
  const isFocused = useIsFocused()

  const sound = useRef(new Audio.Sound());
  const [currentSoundId, setCurrentSoundId] = useState(null);

  const { resetStateObj } = useContext(AddPatientContext);

  const [loading, setloading] = useState(false);


  useEffect(() => {
    setShowWarningPopup(false)
  }, [isFocused])


  const PatientGenderCard = () => (
    <View style={{ marginVertical: 10 }}>
      <Typography.Title color={colors.black} size={fonts.font12}>
        Gender
      </Typography.Title>
      <View
        style={[
          styles.PatientSelectionContainer,
          { width: metrics.screenWidth * 0.43 },
        ]}
      >
        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <RadioButton.Android
            style={[{ alignItems: "center", flexDirection: "row", paddingRight: 20 }]}
            tintColors={{ true: colors.green, false: "black" }}
            status={patientGender[0].isChecked ? 'checked' : 'unchecked'}
          />
          <Typography.SubTitle size={fonts.font12}>Male</Typography.SubTitle>
        </View>

        <View style={{ alignItems: "center", flexDirection: "row" }}>
          <RadioButton.Android
            tintColors={{ true: colors.green, false: "black" }}
            status={patientGender[1].isChecked ? 'checked' : 'unchecked'}
          />
          <Typography.SubTitle size={fonts.font12}>Female</Typography.SubTitle>
        </View>
      </View>
    </View>
  );

  async function playSound(uri, id) {
    try {
      if (currentSoundId === id) {
        setCurrentSoundId(null)
        await stopSound()
      }
      else {
        if (currentSoundId != id) {
          await stopSound()
        }
        await sound.current.loadAsync({ uri: uri }, {}, true);

        const playerStatus = await sound.current.getStatusAsync();

        if (playerStatus.isLoaded) {
          if (playerStatus.isPlaying === false) {
            sound.current.playAsync();
            setCurrentSoundId(id);
          }
          else {
            await stopSound()
          }
        }
        sound.current.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
      }
    } catch (error) {
      console.error("Failed to play sound", error);
      ToastAndroid.showWithGravityAndOffset(
        'Failed to play sound!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    }
  }

  async function stopSound() {
    try {
      const playerStatus = await sound.current.getStatusAsync();

      if (playerStatus.isLoaded === true) {
        await sound.current.unloadAsync()
        setCurrentSoundId(null);
      }
    } catch (error) {
      console.error("Failed to stop sound", error);
    }
  }

  async function handlePlaybackStatusUpdate(status) {
    if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
      await sound.current.unloadAsync();
      setCurrentSoundId(null);
    }
  }


  function getRecordingLines() {
    return recordings?.map((recordingLine, index) => {
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()}
            onPress={() => playSound(recordingLine?.file, recordingLine?.id)}>
            {recordingLine.file != "" ?
              <Text style={styles.play_stop} >
                {currentSoundId == index ?
                  <Text style={styles.btn_text}>&#9208;</Text>
                  :
                  <Text style={styles.btn_text}>&#9654;</Text>
                }</Text>
              :
              <></>}
            {filteredAnteriorTags?.map((ele) =>
            (
              ele.id == index + 1 &&
              ele?.options?.map(option => (
                option.isChecked &&
                <>
                  <Text key={(() => Math.random())()} style={{ ...lungs.tags, color: option?.id == 5 ? colors.black : "#990099" }}>{option.position}</Text>
                </>
              ))

            )
            )}
          </Pressable>
        </>
      );
    });
  }


  function getRecordingLines2() {
    return recordingsPosterior?.map((recordingLine, index) => {
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()}
            onPress={() => playSound(recordingLine?.file, recordingLine?.id)}>
            {recordingLine.file != "" ?
              <Text style={styles.play_stop} >
                {currentSoundId == index + 7 ?
                  <Text style={styles.btn_text}>&#9208;</Text>
                  :
                  <Text style={styles.btn_text}>&#9654;</Text>
                }</Text>
              :
              <></>}
            {filteredPosteriorTags?.map((ele) =>
            (
              ele.id == index + 1 &&
              ele.options?.map(option => (
                option.isChecked &&
                <>
                  <Text key={(() => Math.random())()} style={{ ...lungs.tags, color: option?.id == 5 ? colors.black : "#990099" }}>{option.position}</Text>
                </>
              ))
            )
            )}
            {/* <Text>{recordingLine?.id}</Text> */}
          </Pressable>
        </>
      );
    });
  }

  const handleSaveReport = async () => {
    setloading(true)
    const payload = {
      patient_health_id: newlyCreatedPatientMoreDetailId,
      status: true,
      diagnosis_notes: diagonsisNotes,
    }
    try {
      const response = await LungXinstance.patch(`api/patients/`, payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      if (response.data.status == true) {
        // setTimeout(() => {
        //   setloading(false)
        //   setShowWarningPopup(true)
        // }, 2000);
        handleClearAddPatientData()
        setloading(false)
        setShowWarningPopup(true)
        // resetStateObj();
      } else {
        setloading(false)
      }
    } catch (e) {
      setloading(false)
      console.log("Error handleSaveReport.......", e)
    }
  }

  const handleDiaganosisTextChange = (newText) => {
    setDiagonsisNotes(newText)
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>

        {
          loading ? <LoadingScreen /> : null
        }
        <View style={{ height: 80, width: metrics.screenWidth, }}>
          <ProgressStep currrentStep={currrentStep} setCurrentStep={setCurrentStep} />
        </View>


        {/* Form from patient to complain status  */}

        <View
          style={{ alignItems: "flex-end", width: metrics.screenWidth * 0.9 }}
        >
          <Text color="#000" size={fonts.font12}>
            Patient Status: {patientstatus}
          </Text>
        </View>

        <Textinput label={"Patient Name"} editable={false} value={patientname} />
        <Textinput label={"Patient ID"} editable={false} value={patientid + ""} />

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
            value={patientAge}
            editable={false}
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
            editable={false}
            value={patientWeight}
          />
          <Textinput
            width={metrics.screenWidth * 0.43}
            label="Temperature(C)"
            value={patientTemperture}
            editable={false}
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
            value={patientOxygenLevel}
            editable={false}
          />
          <Textinput
            width={metrics.screenWidth * 0.43}
            label="Blood Pressure(mm/hg)"
            value={patientBloodPressure}
            editable={false}
          />
        </View>

        <ComplaintsCard
          edit={true}
          chiefComplaints={filteredChiefSymptoms}
          chronicDisease={filteredChronicSymptoms}
          lifeStyle={filteredLifeStyle}
        />
        {/*  */}

        <View style={styles.symptomsDetails}>
          <View style={{ ...styles.antRecView }}>
            <Title color={colors.green} size={fonts.font12}>
              Anterior Recordings and Tags
            </Title>
            <TouchableOpacity
              onPress={() => navigation.push("Anterior Recording", {
                EditAnteriorRecTag: 'Edit Anterior Rec Tag'
              })}
            >
              <View
                style={styles.antRecViewEditBtn}>
                <Text style={{ fontFamily: "Montserrat-Medium", color: "#fff", fontSize: 13 }}>
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 10 }}>
            <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
            <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
          </View>

          <View style={lungs.wrapper}>

            <View style={lungs.btn_wrapper}>

              {getRecordingLines()}

            </View>

            <Image style={lungs.img}
              source={require("../assets/images/anterior_guide_crop_old.png")}
            />
          </View>

        </View>

        <View style={styles.symptomsDetails}>
          <View style={{ ...styles.antRecView }}>
            <Title color={colors.green} size={fonts.font12}>
              Posterior Recordings and Tags
            </Title>
            <TouchableOpacity
              onPress={() => navigation.push("Posterior Recording", {
                EditPosteriorRecTag: 'Edit Posterior Rec Tag'
              })}
            >
              <View
                style={styles.antRecViewEditBtn}>
                <Text style={{ fontFamily: "Montserrat-Medium", color: "#fff", fontSize: 13 }}>
                  Edit
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 10 }}>
            <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
            <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
          </View>

          <View style={lungs.wrapper}>

            <View style={lungs.btn_wrapper}>

              {getRecordingLines2()}

            </View>

            <Image style={lungs.img}
              source={require("../assets/images/posterior_crop.png")}
            />
          </View>

          {/* {filteredPosteriorTags.map((item) => (
          <View style={styles.TagContainer}>
            <View
              style={{ flex: 0.5, flexDirection: "row", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={30}
                color={colors.green}
              />
              <Title color={colors.green} size={fonts.font12}>
                {item.position}
              </Title>
            </View>
            <View style={{ flex: 0.5 }}>
              {item.options.map((tag) => (
                <Title color={colors.green} size={fonts.font12}>
                  {tag.position}
                </Title>
              ))}
            </View>
          </View>
        ))} */}
        </View>

        <Textinput label={"Diagnosis Notes"} onChangeText={handleDiaganosisTextChange} value={diagonsisNotes} multiline={true} height={75} />

        <Textinput label={"Additional Notes"} editable={false} value={additionalNotes} multiline={true} height={75} />

        <View
          style={{
            marginVertical: 20,
            justifyContent: 'space-between',
            width: "90%",
            flexDirection: "row",
          }}
        >
          <View style={{ width: metrics.screenWidth * 0.4, left: 5 }}>
            <Button.BtnContain
              label="Go to tagging"
              labelsize={12}
              iconLeft={"arrow-left"}
              color={colors.green}
              onPress={() => navigation.goBack()}
            />
          </View>

          <View style={{ width: metrics.screenWidth * 0.4 }}>
            <Button.BtnContain
              label="Save Report"
              labelsize={12}
              color={colors.green}
              // onPress={() => setShowWarningPopup(true)}
              onPress={() => handleSaveReport()}
            />
          </View>
        </View>
      </ScrollView>
      <Modal visible={showWarningPopup} contentContainerStyle={containerStyle} >
        <View style={warningStyle.main}>
          <Text style={warningStyle.title}>Report Saved</Text>
          <Image source={require("../assets/images/Saved.png")} />
          <View style={warningStyle.btnWrapper}>

            <Pressable onPress={() => { navigation.navigate("Add Patient Home"), setShowWarningPopup(false) }}>
              <Text style={warningStyle.btn}>Go to home</Text>
            </Pressable>
            <Pressable onPress={() => { navigation.navigate("Add Patient Home"); navigation.navigate("Patients list"); setShowWarningPopup(false) }}>
              <Text style={warningStyle.btn}>View Patients list</Text>
            </Pressable>
          </View>

        </View>
      </Modal>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 15,
  },
  symptomsDetails: {
    display: "flex",

    width: metrics.screenWidth * 0.9,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
  },
  button_wrapper: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  PatientSelectionContainer: {
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
    fontSize: fonts.font12,
    color: colors.black,
    flexDirection: "row",
  },
  TagContainer: {
    flexDirection: "row",
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    marginVertical: 10,
    padding: 10,

  },
  play_stop: {
    position: "absolute",
    left: "50%",
  },

  btn_text: {
    fontSize: 30,
    color: "white"
  },
  antRecView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  antRecViewEditBtn: {
    backgroundColor: colors.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  }
});

const containerStyle = { backgroundColor: 'white', padding: 20, width: "90%", alignSelf: "center", borderRadius: 10 };

