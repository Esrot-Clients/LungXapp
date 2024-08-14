import { StyleSheet, ScrollView, Text, View, Button, Image, Pressable, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef, useContext } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lungs } from "../context/AddPatientContext";
import testdel from "./../../assets/testdel.png"
import Constants from "expo-constants";

import * as button from "../components/Atoms/Button";
import metrics from "../constants/layout";
import colors from "../constants/colors";

import { Audio } from "expo-av";
import { AddPatientContext } from "../context/AddPatientContext";
import * as Sharing from 'expo-sharing';
import LungXinstance from "../api/server";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as ExpoFileSystem from 'expo-file-system'
import LoadingScreen from "../components/Atoms/LoadingScreen";
import { FontAwesome } from '@expo/vector-icons';
import ProgressStep from "../components/Molecules/ProgressStep";


export default function AnteriorRecording({ route, navigation }) {
  const EditAnteriorRecTag = route?.params?.EditAnteriorRecTag
  const orientations = ["vertical", "horizontal"];
  const [currrentStep, setCurrentStep] = useState(0);
  const recordingRef = useRef();
  const { manifest } = Constants;
  const [isRecording, setIsRecording] = useState(false)
  const [btnState, setBtnState] = useState([
    null, null, null, null, null, null, null
  ])
  const [message, setMessage] = useState("");
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  const [recordText, setRecordText] = useState("");
  const [currentSoundId, setCurrentSoundId] = useState(null);
  const [portionOnFocus, setPortionOnFocus] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFoucued, setIsFoucued] = useState(false)
  const { recordings, setRecordings, patientid, recordingsPosterior, newlyCreatedPatientId, newlyCreatedPatientLungsId, setNewlyCreatedPatientLungsId, sessionNo } = useContext(AddPatientContext)
  const { user } = useContext(AuthContext);
  const [loading, setloading] = useState(false);

  const payload = new FormData()
  const [recordingTime, setRecordingTime] = useState(10);

  const AudioPlayer = useRef(new Audio.Sound());


  async function handlePatientAnteriorRecordings() {
    if (isRecording) {
      ToastAndroid.showWithGravityAndOffset(
        'Recording not completed. Hang in there!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    } else if (isPlaying) {
      ToastAndroid.showWithGravityAndOffset(
        'The audio is currently playing. Please wait for it to finish.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50
      )
    } else {
      if (EditAnteriorRecTag == "Edit Anterior Rec Tag") {
        navigation.push("Anterior Tagging", {
          EditAnteriorRecTag: EditAnteriorRecTag
        })
      } else {
        navigation.navigate("Posterior Recording");
      }
    }
  }

  async function handlePatientAnteriorRecordingsNew(key, file) {
    const audioFile = {
      uri: file,
      name: file,
      type: "audio/mp3"
    }
    payload.append(key, audioFile)
    try {
      if (newlyCreatedPatientLungsId == null) {
        payload.append("patient", newlyCreatedPatientId)
        payload.append("doctor", user?.id)
        sessionNo && payload.append("session", "session " + sessionNo)

        const res = await LungXinstance.put("/api/lung_audio/", payload, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        setNewlyCreatedPatientLungsId(res?.data?.id)

        recordings.forEach(async (recordingss, index) => {
          if (recordingss.key == key) {
            const uri = `https://lung.thedelvierypointe.com${res?.data?.[key]}`
            // const { sound, status } = await Audio.Sound.createAsync({ uri: uri });
            recordingss.sound = "sound";
            recordingss.file = uri;
          }
        })

      }
      else {
        payload.append("patient", newlyCreatedPatientId)
        payload.append("doctor_id", user?.id)
        payload.append("id", newlyCreatedPatientLungsId)
        sessionNo && payload.append("session", "session " + sessionNo)

        const res = await LungXinstance.patch("/api/lung_audio/", payload, {
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        setNewlyCreatedPatientLungsId(res?.data?.id)

        recordings.forEach(async (recordingss, index) => {
          if (recordingss.key == key) {
            const uri = `https://lung.thedelvierypointe.com${res?.data?.[recordingss.key]}`
            // const { sound, status } = await Audio.Sound.createAsync({ uri: uri });
            recordingss.sound = "sound";
            recordingss.file = uri;
          }
        })

      }
      // setTimeout(() => {
        setRecordText("");
      // }, 1000)

    } catch (error) {
      console.log("eoorr-----------------------------", error)
    }

  }


  async function playSound(id) {
    try {
      if (currentSoundId !== null) {
        console.log("current sound is not null")
        await stopSound();
      }

      const file = recordings.find((recording) => recording.id === id).file;
      await AudioPlayer.current.loadAsync({ uri: file }, {}, true);

      const playerStatus = await AudioPlayer.current.getStatusAsync();

      if (playerStatus.isLoaded) {
        if (playerStatus.isPlaying === false) {
          btnState[id] = "recording"
          AudioPlayer.current.playAsync();
          setCurrentSoundId(id);
        }
      }
      AudioPlayer.current.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);


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

  async function handlePlaybackStatusUpdate(status) {
    if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
      await AudioPlayer.current.unloadAsync();
      setCurrentSoundId(null);
      setIsPlaying(false)
    }
  }

  async function stopSound() {
    try {
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      if (playerStatus.isLoaded === true) {
        await AudioPlayer.current.unloadAsync()
        setCurrentSoundId(null);
      }
    } catch (error) {
      console.error("Failed to stop sound", error);
    }
  }

  async function toggleSound(id) {
    try {
      setPortionOnFocus(id)
      setIsFoucued(true)
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

  async function highlighToggle(id) {
    if (isPlaying) {
      await stopSound();
      setIsPlaying(false)
    }
      setPortionOnFocus(id)
      setIsFoucued(true)
      btnState[id] = "recording"
    
  }

  async function startRecording(id, count, setCount, reRec) {

    if (portionOnFocus != id && portionOnFocus != null) {
      setCount(2)
      setPortionOnFocus(id)
    }
    else if (count === 0) {
      setCount(1)
      setPortionOnFocus(id)
    }
    else {
      try {
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
            staysActiveInBackground: true,
            // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentLockedModeIOS: true,
            // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          });
          // changing the button state from null to start recoding 
          btnState[id] = "recording"
          setBtnState(btnState)

          const { ios, android } = Audio.RecordingOptionsPresets.HIGH_QUALITY;
          const options = {
            android: {
              ...android,
              extension: '.wav',
              sampleRate: 8000,
              bitRate: 16000,
            },
            ios: {
              ...ios,
              extension: '.wav',
              sampleRate: 8000,
              bitRate: 16000,
            },
          };
          const { recording } = await Audio.Recording.createAsync(options);

          // const { recording } = await Audio.Recording.createAsync(
          //   Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          // );

          const timerInterval = setInterval(() => {
            setRecordingTime((prevTime) => prevTime - 1);
          }, 1000);
          // set Portion On Focus for the display of true  re-recording section
          setPortionOnFocus(id)
          setIsFoucued(true)
          setIsRecording(true)
          // saving recording 
          recordingRef.current = recording;
          
          // check if id is valid or not 
          if (typeof id != "number") {
            setMessage("Recording started");
          } else {
            setRecordText(`Re-recording audio ${id}...`);
          }
          //using stopRecording function saving it to the recordings state
          setRecordingTimeout(
            setTimeout(() => {
              ToastAndroid.showWithGravityAndOffset(
                'Recording Completed',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
              );
              clearInterval(timerInterval);
              setRecordingTime(10)
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
      clearTimeout(recordingTimeout);

      try {
        await recording.stopAndUnloadAsync();

        const { sound, status } = await recording.createNewLoadedSoundAsync();
        var file = recording.getURI()
        var recKey = recordings[id].key;

        if (typeof id != "number") {
          await handlePatientAnteriorRecordingsNew(recKey, file)
        } else {
          await handlePatientAnteriorRecordingsNew(recKey, file)
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
    return recordings.map((recordingLine, index) => {
      const [count, setCount] = useState(0);
      return (
        <>
          {
            recordingLine.sound === "" ?
              <>
                <Pressable key={(() => Math.random())()}
                  disabled={isPlaying || (isRecording && portionOnFocus !== recordingLine.id)}
                  style={[styles.button_wrapper, recordingLine.style]}
                  onPress={() => {
                    !isRecording ? startRecording(recordingLine.id, count, setCount) :
                      ToastAndroid.showWithGravityAndOffset(
                        'Recording not completed. Hang in there!',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                      );
                  }}
                >
                  {/* {btnState[index] && <Image style={{...styles.backimg,}} source={testdel}/>}  */}
                  {portionOnFocus == index &&
                    <View style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.25 }} />
                    // <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.17 }} source={testdel} />
                  }

                  {count === 0 ?
                    <></>
                    :
                    <>
                      {btnState[index] &&
                        <View style={styles.state}>
                          <View style={styles.outerCircle}>
                            <View style={styles.innerCircle}>
                            </View>
                          </View>
                          <Text style={styles.recordingText}>{formatTime(recordingTime)}</Text>
                        </View>}
                    </>
                  }
                </Pressable>

              </>
              :
              <>
                <Pressable disabled={isRecording} onPress={() => highlighToggle(index)} style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()}>
                  {portionOnFocus == index &&
                    <View style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.25 }} />
                    // <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.17 }} source={testdel} />
                  }

                  {btnState[index] && portionOnFocus == index && isRecording ?
                    <View style={styles.state}>
                      <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                        </View>
                      </View>
                      <Text style={styles.recordingText}>{formatTime(recordingTime)}</Text>
                    </View>
                    :
                    <TouchableOpacity onPress={() => toggleSound(index)}
                      style={styles.state}
                    >
                      <Text style={styles.recordingText}>{currentSoundId === index ? <><Text>&#9632; Stop</Text></> : <Text>&#9654; Play</Text>}</Text>
                    </TouchableOpacity>
                  }

                </Pressable>

              </>
          }
        </>
      );
    });
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        loading ? <LoadingScreen /> : null
      }


      <View style={{ height: 80, width: metrics.screenWidth, }}>
        <ProgressStep currrentStep={currrentStep} setCurrentStep={setCurrentStep} />
      </View>

      <View style={rereording.recordingWrapper}>
        <Text style={rereording.recordingPosition}>Position : {portionOnFocus}</Text>
        <Pressable style={rereording.reRecording} disabled={isRecording || !isFoucued || isPlaying || !btnState[portionOnFocus]} onPress={() => startRecording(portionOnFocus, 1, '', 're-record')}>
          <Text style={(isRecording || !isFoucued || isPlaying || !btnState[portionOnFocus]) ? rereording.reRecordingActive : rereording.reRecordingText}>
            <FontAwesome name="rotate-left" /> Re-record 
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, }}>
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

      <View
        style={{
          marginBottom: 30,
          alignItems: "flex-end",
          justifyContent: "flex-end",
          flex: 1,
          marginTop: 20,
          width: "94%",
        }}
      >
        <View style={{ width: metrics.screenWidth * 0.48, }}>
          <button.BtnContain
            label={EditAnteriorRecTag ? "Anterior Tagging" : "Posterior"}
            color="#F6FBF9"
            labelsize={12}
            labelColor={colors.green}
            icon={"arrow-right"}
            onPress={() => {
              // handlePatientDetailSubmission();
              handlePatientAnteriorRecordings();
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
    alignItems: "center"
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
    paddingBottom: 1,
    fontWeight: 600
  },
  containerTimer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
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

  },

})



