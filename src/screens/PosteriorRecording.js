import { StyleSheet, ScrollView, Text, View, Button, Image, Pressable, ToastAndroid } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";

import testdel from "./../../assets/testdel.png"

import * as button from "../components/Atoms/Button";
import metrics from "../constants/layout";
import colors from "../constants/colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Audio } from "expo-av";
import { AddPatientContext, lungsPosterior } from "../context/AddPatientContext";
import { AuthContext } from "../context/AuthContext";
import LungXinstance from "../api/server";
import { FontAwesome } from '@expo/vector-icons'; 
import ProgressStep from "../components/Molecules/ProgressStep";


export default function PosteriorRecording({ navigation }) {
  const orientations = ["vertical", "horizontal"];
  const [currrentStep, setCurrentStep] = useState(1);
  const recordingRef = useRef();

  const [isRecording, setIsRecording] = useState(false)
  const [message, setMessage] = useState("");
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  const [recordText, setRecordText] = useState("");
  const [currentSoundId, setCurrentSoundId] = useState(null);
  const [btnState, setBtnState] = useState([
    null, null, null, null, null, null, null, null, null, null, null, null, null, null, null
  ])
  const [portionOnFocus, setPortionOnFocus] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { recordingsPosterior, setRecordingsPosterior } = useContext(AddPatientContext)

  const { newlyCreatedPatientId, newlyCreatedPatientLungsId, handleAnteriorPositionTagging } = useContext(AddPatientContext)
  const { user } = useContext(AuthContext);

 

  async function convert_Url_Blob_File(url) {
    let blob = await fetch(url).then(res => res.blob())
    const file = new File([blob], url.split(":")[3], { type: blob.type })
    return file
  }

  async function handlePatientPosteriorRecordings() {
    const payload = new FormData()

    recordingsPosterior.forEach(async (ele, index) => {
      if (ele.file != "") {
        const audioFile = {
          uri: ele?.file,
          name: ele?.file,
          type: "video/3gp"
        }
        payload.append(ele?.key, audioFile)
      }
      if (index == 5) {
        payload.append("patient", newlyCreatedPatientId)
        payload.append("doctor", user?.id)
        payload.append("id", newlyCreatedPatientLungsId)

        try {
          setTimeout(async () => {
            // console.log("recordingsPosterior.....",payload)
            const res = await LungXinstance.patch("/api/lung_audio/", payload, {
              headers: {
                'content-type': 'multipart/form-data'
              }
            })
            navigation.navigate("Anterior Tagging");

          }, 2000)

        } catch (error) {
          console.log("eoorr------------------------------")
          console.log(error)
        }
      }
    })

  }


  async function playSound(id) {
    try {
      if (currentSoundId !== null) {
        console.log("current sound is not null")
        await stopSound();
      }

      const sound = recordingsPosterior.find((recording) => recording.id === id).sound;

      if (sound) {
        btnState[id] = "recording"
        await sound.playAsync();
        setCurrentSoundId(id);
      } else {
        console.log('No sound found.')
      }
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.stopAsync();
          setCurrentSoundId(null); 
          setIsPlaying(false)
        }
      });
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  }

  async function stopSound() {
    try {
      const recordingLine = recordingsPosterior.find(
        (recording) => recording.id === currentSoundId
      );

      if (recordingLine && recordingLine.sound) {
        await recordingLine.sound.stopAsync();
        setCurrentSoundId(null);
      }
    } catch (error) {
      console.error("Failed to stop sound", error);
    }
  }

  async function toggleSound(id) {
    try {
      setPortionOnFocus(id)

      if (currentSoundId !== null && currentSoundId === id) {
        await stopSound();
        setIsPlaying(false)

      } else {
        await playSound(id);
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Failed to toggle sound", error);
    }
  }

  async function startRecording(id, count, setCount, reRec) {
    if (count === 0) {
      setCount(1)
      setPortionOnFocus(id)
    }
    else {
      try {
        // console.log(id);
        const permission = await Audio.requestPermissionsAsync();
        // check if we are already reorcing or not
        if (isRecording) return setMessage("Already Recording");
        // check for permission of recording
        if (permission.status === "granted") {
          ToastAndroid.showWithGravityAndOffset(
            'Recording in progress...',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50
          );
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
          // changing the button state from null to start recoding 
          btnState[id] = "recording"
          setBtnState(btnState)
          // recording 

          const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
          // set Portion On Focus for the display of true  re-recording section
          setPortionOnFocus(id)
          setIsRecording(true)
          // saving recording 

          recordingRef.current = recording;

          if (typeof id != "number") {
            setMessage("Recording started");
          } else {
            setRecordText(`Re-recording audio ${id}...`);
          }
          setRecordingTimeout(
            setTimeout(() => {
              setIsRecording(false)
              stopRecording(id);
              if (reRec != 're-record') {
                setCount(0)
              }
            }, 10000)
          );
        } else {
          setMessage("Please grant permission to app to access the microphone");
        }
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }
  }

  async function stopRecording(id) {
    const recording = recordingRef.current;
    recordingRef.current = null;

    if (recording) {
      clearTimeout(recordingTimeout); // Clear the recording timeout

      try {
        await recording.stopAndUnloadAsync();

        const { sound, status } = await recording.createNewLoadedSoundAsync();
        if (typeof id != "number") {
          const updatedRecordings = [...recordingsPosterior];
          updatedRecordings.push({
            id: recordingsPosterior.length + 1,
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
          });

          setRecordingsPosterior(updatedRecordings);
          setMessage("");
        } else {
          recordingsPosterior.forEach((recordingss, index) => {
            if (recordingss.id == id) {
              recordingss.sound = sound;
              recordingss.duration = getDurationFormatted(status.durationMillis);
              recordingss.file = recording.getURI();
            }
          });

          setRecordText("");
        }
      } catch (err) {
        console.error("Failed to stop recording", err);
      }
    }
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordingsPosterior.map((recordingLine, index) => {
      const [count, setCount] = useState(0);
      return (
        <>
          {
            recordingLine.sound === "" ?
              <>
                <Pressable key={(() => Math.random())()}
                  disabled={isPlaying || (isRecording && portionOnFocus !== recordingLine.id)}
                  style={[recordingLine.style, styles.button_wrapper]}
                  onPress={() => !isRecording ? startRecording(recordingLine.id, count, setCount) : (() => { setIsRecording(false); stopRecording(recordingLine.id) })()}
                >
                  {/* {btnState[index+7] && <Image style={styles.backimg} source={testdel}/>}  */}
                  {portionOnFocus == index + 7 && <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.13 }} source={testdel} />}

                  {count === 0 ?
                    <></>
                    :
                    <>
                      {btnState[index + 7] &&
                        <View style={styles.state}>
                          <View style={styles.outerCircle}>
                            <View style={styles.innerCircle}>
                            </View>
                          </View>
                          <Text style={styles.recordingText}>Rec</Text>
                        </View>
                      }
                    </>}
                </Pressable>

              </>
              :
              <>
                <Pressable disabled={isRecording} onPress={() => toggleSound(recordingLine.id)} style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()}>
                  {portionOnFocus == index + 7 && <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.13 }} source={testdel} />}

                  {btnState[index + 7] && portionOnFocus == index + 7 && isRecording ?
                    <View style={styles.state}>
                      <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                        </View>
                      </View>
                      <Text style={styles.recordingText}>Re-rec</Text>
                    </View>
                    :
                    <View
                      style={styles.state}
                    >
                      <Text style={styles.recordingText}>{currentSoundId === recordingLine.id ? <Text>&#9654; Stop</Text> : <Text>&#9654; Play</Text>}</Text>
                    </View>
                  }

                </Pressable>

              </>
          }




        </>
      );
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={{ height: 80, width: metrics.screenWidth,}}>       
        <ProgressStep  currrentStep={currrentStep} setCurrentStep={setCurrentStep}/>
      </View>


      <View style={rereording.recordingWrapper}>
        <Text style={rereording.recordingPosition}>Position : {portionOnFocus}</Text>
        <Pressable style={rereording.reRecording} disabled={isRecording || !portionOnFocus || isPlaying || !btnState[portionOnFocus]} onPress={() => startRecording(portionOnFocus, 1, '', 're-record')}>
          <Text style={(isRecording || !portionOnFocus || isPlaying || !btnState[portionOnFocus]) ? rereording.reRecordingActive : rereording.reRecordingText}>
          <FontAwesome name="rotate-left" /> Re-record
          </Text>
        </Pressable>
      </View>


      <View style={lungsPosterior.wrapper}>

        <View style={lungsPosterior.btn_wrapper}>

          {getRecordingLines()}

        </View>

        <Image style={lungsPosterior.img}
          source={require("../assets/images/posterior_crop.png")}
        />
      </View>


      <View
        style={{
          marginBottom: 30,
          flexDirection:'row',
          justifyContent: 'space-between',
          flex: 1,
          marginTop: 20,
          width:"94%",
        }}
      >
        <View style={{ width: metrics.screenWidth * 0.4 ,left:5}}>
          <button.BtnContain
            label="Anterior"
            color="#F6FBF9"
            labelsize={12}
            labelColor={colors.green}
            iconLeft={"arrow-left"}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={{ width: metrics.screenWidth * 0.4 }}>
          <button.BtnContain
            label="Continue"
            color="#F6FBF9"
            labelsize={12}
            labelColor={colors.green}
            icon={"arrow-right"}
            onPress={() => {
              //   handlePatientDetailSubmission();
              handlePatientPosteriorRecordings()
            }}
          />
        </View>
      </View>
    </ScrollView>
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

  // container: {
  //   flex: 1,
  //   backgroundColor: "#fff",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    // margin: 16,
  },
  button_wrapper: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  button1: {
    borderWidth: 1,
    borderColor: "white",
    display: "flex",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  state: {
    display: "flex",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 1,
    paddingHorizontal: 4,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,1)",
  },
  pressable_text: {
    color: "white"
  },
  outerCircle: {
    borderWidth: 2,
    borderColor: "red",
    height: 18,
    width: 18,
    borderRadius: 11,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  innerCircle: {
    borderWidth: 2,
    borderColor: "red",
    height: 8,
    width: 8,
    borderRadius: 5
  },
  recordingText: {
    fontSize: 14,
    paddingLeft: 6,
    fontWeight: 600,
    paddingBottom: 1,
  }
});

const rereording = StyleSheet.create({
  recordingWrapper: {
    display: "flex",
    borderColor: "rgba(0,0,0,.15)",
    borderWidth: 1,
    width: "90%",
    margin: 10,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    fontSize: 20,
    marginBottom: 50,

  },
  recordingPosition: {
    fontSize: 18,
  },
  reRecording: {
  },

  reRecordingActive: {
    color: "#ff9c84",
    // color: "rgba(0,0,0,.6)",
    fontSize: 18,
  },
  reRecordingText: {
    fontSize: 18,
    color: "red"

  }
})



