import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";

import { AddPatientContext, lungs } from "../context/AddPatientContext";

import * as Typography from "../components/Atoms/Typography"
import * as Button from "../components/Atoms/Button";
import metrics from "../constants/layout";
import colors from "../constants/colors";
import fonts from "../constants/fontsSize";

import { SubTitle } from "../components/Atoms/Typography";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Checkbox from "expo-checkbox";
import { RadioButton, Modal } from 'react-native-paper';
import testdel from "./../../assets/testdel.png"

import { commonStyle, warningStyle } from "./PosteriorTagging";
import { useIsFocused } from "@react-navigation/native";
import LungXinstance from "../api/server";
import { AuthContext } from "../context/AuthContext";
import ProgressStep from "../components/Molecules/ProgressStep";
import { Audio } from "expo-av";

export default function AnteriorTagging({ route, navigation }) {
  const EditAnteriorRecTag = route?.params?.EditAnteriorRecTag

  const { recordings, setRecordings, tags, AnteriorTagging, handleAnteriorPositionTagging, handleTagDiscarding, handleTaggingAllAnteriorPosition, handleAnteriorFiltering, filteredAnteriorTags, newlyCreatedPatientId, newlyCreatedPatientLungsId }
    = useContext(AddPatientContext);
  const { user } = useContext(AuthContext);


  const AudioPlayer = useRef(new Audio.Sound());

  const [currrentStep, setCurrentStep] = useState(2);

  const [alltagVisible, setallTagVisible] = useState(true);

  const [activeLungsection, setActiveLungsection] = useState(null)

  const [recordingsPosition, setRecordingPosition] = useState([
    {
      id: 0,
      style: lungs.btn0,
    },
    {
      id: 1,
      style: lungs.btn1,
    },
    {
      id: 2,
      style: lungs.btn2

    },
    {
      id: 3,
      style: lungs.btn3

    },
    {
      id: 4,
      style: lungs.btn4

    },
    {
      id: 5,
      style: lungs.btn5

    },
    {
      id: 6,
      style: lungs.btn6

    },
  ]);

  const [showSoundsPopup, setShowSoundsPopup] = useState(false)
  const [showWarningPopup, setShowWarningPopup] = useState(false)

  const isFocused = useIsFocused()
  useEffect(() => {
    setShowWarningPopup(false)
  }, [isFocused])

  function getRecordingLines() {
    return recordingsPosition.map((recordingLine, index) => {
      return (
        <>
          <Pressable onPress={() => { setallTagVisible(false); setActiveLungsection(recordingLine?.id) }} style={[recordingLine.style, styles.button_wrapper]} key=
            {(() => Math.random())()}>
            {activeLungsection == index &&
              <View style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.25 }} />
              // <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.17 }} source={testdel} />
            }
            {AnteriorTagging.map((ele) =>
            (
              ele.id == index + 1 &&

              ele.options.map(option => (
                option.isChecked && option.id != 6 && 
                // option.id != 5 &&
                <>
                  <Text key={(() => Math.random())()} style={lungs.tags}>{option.position}</Text>
                </>
              ))

            )
            )}
          </Pressable>
        </>
      );
    });
  }

  // recorded sound section

  const [currentSoundId, setCurrentSoundId] = useState(null);


  async function playSound(id) {
    try {
      if (currentSoundId !== null) {
        console.log("current sound is not null")
        await stopSound();
      }
      // const sound = recordings.find((recording) => recording.id === id).sound;
      // if (sound) {
      //   await sound.playAsync();
      //   setCurrentSoundId(id);
      // } else {
      //   console.log('No sound found.')
      // }
      const file = recordings.find((recording) => recording.id === id).file;
      await AudioPlayer.current.loadAsync({ uri: file }, {}, true);

      const playerStatus = await AudioPlayer.current.getStatusAsync();

      if (playerStatus.isLoaded) {
        if (playerStatus.isPlaying === false) {
         AudioPlayer.current.playAsync();
         setCurrentSoundId(id);
        }
      }
      AudioPlayer.current.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  }

  async function handlePlaybackStatusUpdate(status) {
    if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
      await AudioPlayer.current.unloadAsync();
      setCurrentSoundId(null);
    }
  }

  async function stopSound() {
    try {
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      if (playerStatus.isLoaded === true) {
        await AudioPlayer.current.unloadAsync()
        setCurrentSoundId(null);
      }
      // const recordingLine = recordings.find(
      //   (recording) => recording.id === currentSoundId
      // );
      // if (recordingLine && recordingLine.sound) {
      //   await recordingLine.sound.stopAsync();
      //   setCurrentSoundId(null);
      // }
    } catch (error) {
      console.error("Failed to stop sound", error);
    }
  }

  async function toggleSound(id) {
    try {

      if (currentSoundId !== null && currentSoundId === id) {
        await stopSound();

      } else {
        await playSound(id);

      }
    } catch (error) {
      console.error("Failed to toggle sound", error);
    }
  }

  function listenRecordings() {
    return recordings.map((ele, index) => {
      return (
        <Pressable disabled={!ele?.sound} style={listenRecordingsStyle.pressable} onPress={() => toggleSound(index)} key={(() => Math.random())()}>
          <Text>Position : {index}</Text>
          {ele?.sound && <Text >{currentSoundId == index ? <Text>&#9654; stop</Text> : <Text>&#9654; play</Text>}</Text>}
        </Pressable>
      );
    });
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={{ height: 80, width: metrics.screenWidth, }}>
          <ProgressStep currrentStep={currrentStep} setCurrentStep={setCurrentStep} />
        </View>

        {/* popup populate button for listen soungd */}
        <View style={styles.recorded}>
          <Text></Text>
          <Pressable onPress={() => setShowSoundsPopup(true)}>
            <Text style={styles.recordedSound} >Recorded Sounds</Text>
          </Pressable>
        </View>


        {/* all 6 tags checkbox rows*/}
        <>
          {AnteriorTagging.map((position, index) => (
            <>
              <View key={(() => Math.random())()} style={activeLungsection == index ? styles.activeTagCheckboxRow : styles.disabledTagCheckboxRow}>

                <View style={styles.SymptomsCard}>
                  <SubTitle size={fonts.font12} >Tagging for {position.position}</SubTitle>
                </View>
                <View style={styles.optionsCard}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                      backgroundColor: "#F6FBF9",
                      width: metrics.screenWidth,
                    }}
                    contentInset={{
                      top: 0,
                      bottom: 0,
                    }}
                  >
                    {position.options.map((symptom) => (
                      <View
                        key={(() => Math.random())()}
                        style={{
                          alignItems: "flex-start",
                          paddingHorizontal: 5,
                          paddingVertical: 5,
                          // width: 130,
                          marginLeft: 3,
                        }}
                      >
                        <View
                          style={{ alignItems: "center", flexDirection: "row" }}
                        >
                          <RadioButton
                            style={{ backgroundColor: "#fff" }}
                            status={symptom.isChecked ? 'checked' : 'unchecked'}
                            tintColors={{ true: colors.green, false: "grey" }}
                            onPress={(state) => {
                              handleAnteriorPositionTagging(
                                position.id,
                                symptom.id,
                                state,
                                symptom.isChecked
                              );
                            }}
                          />
                          <View style={{ width: 2 }} />
                          <Typography.SubTitle size={fonts.font10}>
                            {symptom.position}
                          </Typography.SubTitle>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </>
          ))}
        </>

        {/* total tags checbox row */}
        {alltagVisible && (
          <View style={{ marginVertical: 5, marginTop: 20 }}>
            <View style={styles.optionsCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  backgroundColor: "#F6FBF9",
                  width: metrics.screenWidth,
                }}
                contentInset={{
                  top: 0,
                  bottom: 0,
                }}
              >{tags.length > 0 &&
                tags.map((symptom, index) => (
                  <View
                    key={(() => Math.random())()}
                    style={{
                      alignItems: "flex-start",
                      paddingHorizontal: 6,
                      paddingVertical: 5,
                      // width: 120, 
                      marginLeft: 3,
                    }}
                  >
                    <View style={{ alignItems: "center", flexDirection: "row", }}>

                      <RadioButton.Android
                        theme={{ padding: 100 }}
                        status={symptom.isChecked ? 'checked' : 'unchecked'}
                        tintColors={{ true: colors.green, false: "grey" }}
                        onPress={(state) => {
                          handleTaggingAllAnteriorPosition(symptom.position, state ,symptom.isChecked);
                        }}
                      >

                      </RadioButton.Android>
                      <View style={{ width: 2 }} />
                      <Typography.SubTitle size={fonts.font10}>
                        {symptom.position}
                      </Typography.SubTitle>
                    </View>
                  </View>
                ))
                }
              </ScrollView>
            </View>
          </View>
        )}

        {/* total & discard tags */}
        <View
          style={{
            width: metrics.screenWidth * 0.9,
            flexDirection: "row",
            justifyContent: "space-between", marginTop: 10
          }}
        >
          <TouchableOpacity onPress={() => { setActiveLungsection(null); setallTagVisible(true) }}>
            <Text style={commonStyle.btn3}>Tag total lungs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTagDiscarding()}>
            <Text style={commonStyle.btn3} size={fonts.font12}>
              Discard Tags
            </Text>
          </TouchableOpacity>
        </View>




        {/* lungs image and activeLungsection selector buttons */}

        {/* <View style={{ width: metrics.screenWidth * 0.9, marginBottom: 40 }}>
          <Text style={commonStyle.btn3}>Click to Select Positions</Text>
        </View> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 20 }}>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
        </View>

        <View style={lungs.wrapper}>

          <View style={lungs.btn_wrapper}>

            {getRecordingLines()}

          </View>

          <Image style={lungs.img}
            source={require("../assets/images/anterior_guide_crop_old.png")}
          />
        </View>
        <View
          style={{
            marginVertical: 20,
            alignItems: "flex-end",
            justifyContent: "flex-end",
            flex: 1,
            marginTop: 20,
            width: "94%",
          }}
        >
          <View style={{ width: metrics.screenWidth * 0.65, marginVertical: 20 }}>
            <Button.BtnContain
              label={EditAnteriorRecTag ? "Continue to save" : "Continue to tag Posterior"}
              color="#F6FBF9"
              labelsize={12}
              labelColor={colors.green}
              icon={"arrow-right"}
              onPress={() => {
                setShowWarningPopup(true)
              }}
            />
          </View>
        </View>
      </ScrollView>
      <Modal visible={showSoundsPopup} contentContainerStyle={containerStyle} onDismiss={() => setShowSoundsPopup(false)}>
        <View style={listenRecordingsStyle.main}>
          <Text style={listenRecordingsStyle.title}>Recorded Sounds</Text>
          {listenRecordings()}
          <Pressable onPress={async() => { await stopSound();setShowSoundsPopup(false)}}>

            <Text style={listenRecordingsStyle.btn}>Close</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal visible={showWarningPopup} contentContainerStyle={containerStyle} onDismiss={() => setShowWarningPopup(false)}>
        <View style={warningStyle.main}>
          <Text style={warningStyle.title}>Confirm</Text>
          <Text style={warningStyle.title2}>Continue to {EditAnteriorRecTag ? "save" : "Tag Posterior"} ?</Text>
          <Text style={warningStyle.warn}>Rest all positions will auto tag to Normal</Text>
          <View style={warningStyle.btnWrapper}>

            <Pressable onPress={() => setShowWarningPopup(false)}>
              <Text style={warningStyle.btn}>Cancel</Text>
            </Pressable>
            {EditAnteriorRecTag == "Edit Anterior Rec Tag" ?
              <Pressable onPress={() => {
                navigation.navigate("Overall Report"); setShowWarningPopup(false), handleAnteriorFiltering({
                  patient: newlyCreatedPatientId,
                  doctor: user.id,
                  id: newlyCreatedPatientLungsId
                })
              }}>
                <Text style={warningStyle.btn}>Continue</Text>
              </Pressable>
              :
              <Pressable onPress={() => {
                navigation.navigate("Posterior Tagging"); setShowWarningPopup(false), handleAnteriorFiltering({
                  patient: newlyCreatedPatientId,
                  doctor: user.id,
                  id: newlyCreatedPatientLungsId
                })
              }}>
                <Text style={warningStyle.btn}>Continue</Text>
              </Pressable>}
          </View>

        </View>
      </Modal>

    </>
  );
}



const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignItems: "center",
  },
  backimg: {
    position: "absolute",
    height: "100%",
    width: "100%",

  },
  SymptomsCard: {
    flexDirection: "row",
    width: metrics.screenWidth * 0.9,
    padding: 10,
    marginLeft: 15
  },
  optionsCard: {
    width: metrics.screenWidth,
    // marginVertical: 10,
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
  activeTagCheckboxRow: {
    // borderWidth:5,
    // borderColor:"blue"
  },
  disabledTagCheckboxRow: {
    height: 0
  },
  recorded: {
    width: "90%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",

  },
  recordedSound: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: "red",
    borderWidth: 1,
    borderColor: "red",
    fontWeight: "600"
  },
  radioButton: {
    backgroundColor: "#fff",
    width: 150,

  }
  ,
  symptomName: {
    fontSize: 14,
    // marginLeft:-50

  }
});

const listenRecordingsStyle = StyleSheet.create({
  main: {
    display: "flex",
    alignItems: 'center'

  },
  pressable: {
    width: 200,
    padding: 6,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,.05)",
    borderRadius: 6
  },
  title: {
    color: "red",
    fontWeight: "600",
    fontSize: 18,
    paddingBottom: 12

  },
  btn: {
    color: "white",
    backgroundColor: "#51B592",
    fontWeight: "600",
    fontSize: 18,
    paddingVertical: 4,
    paddingHorizontal: 50,
    borderRadius: 6,
    marginTop: 12,

  }
})




const containerStyle = { backgroundColor: 'white', padding: 20, width: "90%", alignSelf: "center", borderRadius: 10 };

