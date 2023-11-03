import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Image } from "react-native";
import React, { useState, useContext, useEffect, useRef } from "react";

import * as Button from "../components/Atoms/Button";
import metrics from "../constants/layout";
import colors from "../constants/colors";
import fonts from "../constants/fontsSize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import Checkbox from "expo-checkbox";
import { RadioButton, Modal } from 'react-native-paper';
import testdel from "./../../assets/testdel.png"


import { SubTitle } from "../components/Atoms/Typography";

import { AddPatientContext, lungsPosterior } from "../context/AddPatientContext";
import { useIsFocused } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import LungXinstance from "../api/server";
import ProgressStep from "../components/Molecules/ProgressStep";
import { Audio } from "expo-av";

export default function PosteriorTagging({ navigation, route }) {
  const EditPosteriorRecTag = route?.params?.EditPosteriorRecTag
  const { recordingsPosterior, setRecordingsPosterior, PosteriorTagging, setPosteriorTagging, handlePosteriorfiltering, newlyCreatedPatientLungsId, newlyCreatedPatientId, settagsPosterior, tagsposterior } = useContext(AddPatientContext)
  const { user } = useContext(AuthContext);

  const AudioPlayer = useRef(new Audio.Sound());

  const [currrentStep, setCurrentStep] = useState(3);

  const [alltagVisible, setallTagVisible] = useState(true)
  const [activeLungsection, setActiveLungsection] = useState(null)
  const [showSoundsPopup, setShowSoundsPopup] = useState(false)
  const [showWarningPopup, setShowWarningPopup] = useState(false)
  const isFocused = useIsFocused()


  useEffect(() => {
    setShowWarningPopup(false)
  }, [isFocused])


  function getRecordingLines() {
    return recordingsPosterior?.map((recordingLine, index) => {
      return (
        <>
          <Pressable onPress={() => { setallTagVisible(false); setActiveLungsection(recordingLine?.id) }} style={[styles.button_wrapper, recordingLine.style]} key={(() => Math.random())()}>
            {activeLungsection == index + 7 &&
              <View style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.25 }} />
              // <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.25 }} source={testdel} />
            }

            {PosteriorTagging?.map((ele) =>
            (
              ele.id == index + 1 &&
              ele.options.map(option => (
                option.isChecked && option.id != 6 &&
                //  option.id != 5 &&
                <>
                  <Text key={(() => Math.random())()} style={lungsPosterior.tags}>{option.position}</Text>
                </>
              ))
            )
            )}

          </Pressable>
        </>
      );
    });
  }


  const [currentSoundId, setCurrentSoundId] = useState(null);


  async function playSound(id) {
    try {
      if (currentSoundId !== null) {
        console.log("current sound is not null")
        await stopSound();
      }

      const file = recordingsPosterior.find((recording) => recording.id === id).file;
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


    } catch (error) {
      console.error("Failed to stop sound", error);
    }
  }

  async function toggleSound(id) {
    try {
      // set Portion On Focus for the display of true  re-recording section

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
    return recordingsPosterior.map((ele, index) => {
      return (
        <Pressable disabled={!ele?.sound} style={listenRecordingsStyle.pressable} onPress={() => toggleSound(ele?.id)} key={(() => Math.random())()}>
          <Text>Position : {ele?.id}</Text>
          {ele?.sound && <Text >{currentSoundId == ele.id ? <Text key={(() => Math.random())()}>&#9632; stop</Text> : <Text key={(() => Math.random())()}>&#9654; play</Text>}</Text>}
        </Pressable>
      );
    });
  }

  const handleTaggingAllAnteriorPosition = (symptomsName, state, checkStatus) => {
    const newtag = tagsposterior.map((symptoms) => {
      if (symptomsName === "All" && state && !checkStatus) {
        if (symptoms.id == 5) {
          return { ...symptoms, isChecked: false }
        } else {
          return { ...symptoms, isChecked: true }
        }
      }
      else if (symptomsName === "All" && state && checkStatus) {
        if (symptoms.id != 5) {
          return { ...symptoms, isChecked: false }
        }
      }
      else if (symptomsName === "Normal" && state && !checkStatus) {
        if (symptoms.id == 5) {
          return { ...symptoms, isChecked: true }
        } else {
          return { ...symptoms, isChecked: false }
        }
      }
      else if (symptomsName === "Normal" && state && checkStatus) {
        if (symptoms.id == 5) {
          return { ...symptoms, isChecked: false }
        }
      }
      else if (symptoms.position == symptomsName && checkStatus) {
        return { ...symptoms, isChecked: false }
      }
      else if (symptoms.position == symptomsName && !checkStatus) {
        return { ...symptoms, isChecked: true }
      }
      else if (symptoms.id == 5 && symptoms.isChecked == true) {
        return { ...symptoms, isChecked: false }
      }
      else if (symptoms.id == 6 && symptoms.isChecked == true) {
        return { ...symptoms, isChecked: false }
      }
      else if (symptoms.position == symptomsName && !state) {
        return { ...symptoms, isChecked: false }
      }
      return symptoms;
    });
    settagsPosterior(newtag);

    const newAnteriorTagging = PosteriorTagging.map((position) => {
      const newAnteriorOption = position.options.map((symptoms) => {
        if (symptomsName === "All" && state && !checkStatus) {
          if (symptoms.id == 5) {
            return { ...symptoms, isChecked: false }
          } else {
            return { ...symptoms, isChecked: true }
          }
        }
        else if (symptomsName === "All" && state && checkStatus) {
          if (symptoms.id != 5) {
            return { ...symptoms, isChecked: false }
          }
        }
        else if (symptomsName === "Normal" && state && !checkStatus) {
          if (symptoms.id == 5) {
            return { ...symptoms, isChecked: true }
          } else {
            return { ...symptoms, isChecked: false }
          }
        }
        else if (symptomsName === "Normal" && state && checkStatus) {
          if (symptoms.id == 5) {
            return { ...symptoms, isChecked: false }
          }
        }
        else if (symptoms.position === symptomsName && state && checkStatus) {
          return { ...symptoms, isChecked: false }
        }
        else if (symptoms.position === symptomsName && state && !checkStatus) {
          return { ...symptoms, isChecked: true }
        }
        else if (symptoms.id == 5 && symptoms.isChecked == true) {
          return { ...symptoms, isChecked: false }
        }
        else if (symptoms.id == 6 && symptoms.isChecked == true) {
          return { ...symptoms, isChecked: false }
        }
        else if (symptoms.position === symptomsName && !state) {
          return { ...symptoms, isChecked: false }
        }
        return symptoms;
      });
      return { ...position, options: newAnteriorOption };
    });
    setPosteriorTagging(newAnteriorTagging);
  };

  const handleTagDiscarding = () => {
    const newtags = tagsposterior.map(
      symptoms => {
        return { ...symptoms, isChecked: false }
      }

    )
    settagsPosterior(newtags)
    const newAnteriorTagging = PosteriorTagging.map((position) => {
      const newOptions = position.options.map((option) => {
        return { ...option, isChecked: false };
      });
      return { ...position, options: newOptions };
    });
    setPosteriorTagging(newAnteriorTagging);
  };


  //Anterior Tagging controller runs on  input changes (checkboxes)

  const handleAnteriorPositionTagging = (positionid, optionid, state, checkStatus) => {

    const newAnteriorTagging = PosteriorTagging.map((position) => {
     
      if (optionid == 5 && position.id === positionid) {
        const newOptions = position.options.map((option) => {
          if (!state) {
            return { ...option, isChecked: false };
          }
          if (state && !checkStatus) {
            if (option.id == 5) {
              return { ...option, isChecked: true };
            } else {
            return { ...option, isChecked: false };
            }
          }
          else if(state && checkStatus){
            return { ...option, isChecked: false };
          }
          return option;
        });
        return { ...position, options: newOptions };
      }
      if (position.id === positionid && optionid != 6) {
        const newOptions = position.options.map((option) => {
          if (option.id === 5 && option.isChecked ) {
            return { ...option, isChecked: false };
          }else if (option.id === 6 && option.isChecked ) {
            return { ...option, isChecked: false };
          }
          else if (option.id === optionid) {
            return { ...option, isChecked: !option.isChecked };
          }
          
          return option;
        });
        return { ...position, options: newOptions };
      }
      if (optionid == 6 && position.id === positionid) {
        const newOptions = position.options.map((option) => {
          if (!state) {
            return { ...option, isChecked: false };
          }
          if (state && !checkStatus) {
            if (option.id == 5) {
              return { ...option, isChecked: false };
            } else {
            return { ...option, isChecked: true };
            }
          }
          else if(state && checkStatus){
            return { ...option, isChecked: false };
          }
          return option;
        });
        return { ...position, options: newOptions };
      }
      return position;
    });
    setPosteriorTagging(newAnteriorTagging);
  };


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



        <>
          {PosteriorTagging.map((position, index) => (
            <>
              <View key={(() => Math.random())()} style={activeLungsection == index + 7 ? styles.activeTagCheckboxRow : styles.disabledTagCheckboxRow}>
                {/* <View style={{ width: metrics.screenWidth * 0.9 }}>
                  <Text style={commonStyle.btn3} color={colors.green}>Tag Positions</Text>
                </View> */}
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
                    {position.options.map((symptom, index) => (
                      <View key={(() => Math.random())()}
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
                          <RadioButton.Android
                            style={{ backgroundColor: '#fff' }}
                            status={symptom.isChecked ? 'checked' : 'unchecked'}
                            tintColors={{ true: colors.green, false: "grey" }}
                            onPress={(state) => { handleAnteriorPositionTagging(position.id, symptom.id, state, symptom.isChecked) }}
                          />
                          <View style={{ width: 5 }} />
                          <SubTitle size={fonts.font10}>
                            {symptom.position}
                          </SubTitle>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </>
          ))}

        </>

        {
          alltagVisible && (
            <View style={{ marginTop: 20, marginVertical: 5, }}>
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
                  {tagsposterior.length > 0 && tagsposterior.map((symptom, index) => (
                    <View key={(() => Math.random())()}
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
                        <RadioButton.Android
                          style={{ backgroundColor: '#fff' }}
                          status={symptom.isChecked ? 'checked' : 'unchecked'}
                          tintColors={{ true: colors.green, false: "grey" }}
                          onPress={(state) => { handleTaggingAllAnteriorPosition(symptom.position, state, symptom.isChecked) }}
                        />
                        <View style={{ width: 2 }} />
                        <SubTitle size={fonts.font10}>
                          {symptom.position}
                        </SubTitle>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          )
        }

        <View style={{ width: metrics.screenWidth * 0.9, flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity onPress={() => { setActiveLungsection(null); setallTagVisible(true) }}>
            <Text style={commonStyle.btn3}>Tag total lungs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTagDiscarding()}>
            <Text style={commonStyle.btn3} color={colors.red} size={fonts.font12}>Discard Tags</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 20 }}>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
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
            marginVertical: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
            marginTop: 20,
            width: "97%",
          }}
        >
          <View style={{ width: metrics.screenWidth * 0.43, left: 5 }}>
            {EditPosteriorRecTag ?
              <></> :
              <Button.BtnContain
                label="Anterior tagging"
                color="#F6FBF9"
                labelsize={12}
                labelColor={colors.green}
                iconLeft={"arrow-left"}
                onPress={() => {
                  navigation.goBack();
                }}
              />
            }
          </View>

          <View style={{ width: metrics.screenWidth * 0.49, }}>
            <Button.BtnContain
              label={EditPosteriorRecTag ? "Continue to save" : "Continue to report"}
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
          <Pressable onPress={async () => { await stopSound(); setShowSoundsPopup(false) }}>
            <Text style={listenRecordingsStyle.btn}>Close</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal visible={showWarningPopup} contentContainerStyle={containerStyle} onDismiss={() => setShowWarningPopup(false)}>
        <View style={warningStyle.main}>
          <Text style={warningStyle.title}>Confirm</Text>
          <Text style={warningStyle.title2}>Continue to {EditPosteriorRecTag ? "save" : "report"} ?</Text>
          <Text style={warningStyle.warn}>Rest all positions will auto tag to Normal</Text>
          <View style={warningStyle.btnWrapper}>

            <Pressable onPress={() => setShowWarningPopup(false)}>
              <Text style={warningStyle.btn}>Cancel</Text>
            </Pressable>
            <Pressable onPress={() => {
              navigation.navigate("Overall Report"); setShowWarningPopup(false); handlePosteriorfiltering({
                patient: newlyCreatedPatientId,
                doctor: user.id,
                id: newlyCreatedPatientLungsId
              })
            }}>
              <Text style={warningStyle.btn}>Continue</Text>
            </Pressable>
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

});

const listenRecordingsStyle = StyleSheet.create({
  main: {
    display: "flex",
    alignItems: 'center'

  },
  pressable: {
    width: 250,
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

export const commonStyle = StyleSheet.create({
  btn3: {
    backgroundColor: "#F7FBF9",
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: colors.green,
    borderRadius: 4,
    display: "flex",
    alignSelf: "flex-start",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.green

  }
})
export const warningStyle = StyleSheet.create({
  main: {
    display: "flex",
    alignItems: 'center',

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
    fontWeight: "600",
    fontSize: 22,
    paddingBottom: 40

  },
  title2: {

    fontWeight: "600",
    fontSize: 18,
    paddingBottom: 40,
    alignSelf: "flex-start",

  },
  warn: {
    alignSelf: "flex-start",
    fontWeight: "600",
    fontSize: 18,
    paddingBottom: 40

  },
  img: {
    paddingBottom: 40
  },
  btnWrapper: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 80

  },
  btn: {
    color: "white",
    backgroundColor: "#51B592",
    fontWeight: "600",
    fontSize: 15,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 12,
    // width:153,
    minWidth: "48%",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
  }
})

const containerStyle = { backgroundColor: 'white', padding: 20, width: "90%", alignSelf: "center", borderRadius: 10 };
