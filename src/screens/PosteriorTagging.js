import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Pressable, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";

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


const SymptomsData = [
  {
    id: 1,
    position: "Coarse crackle",
    isChecked: false,
  },
  {
    id: 2,
    position: "Fine crackle",
    isChecked: false,
  },
  {
    id: 3,
    position: "Ronchi",
    isChecked: false,
  },
  {
    id: 4,
    position: "Wheeze",
    isChecked: false,
  },

  {
    id: 5,
    position: "Normal",
    isChecked: false,
  },

  {
    id: 6,
    position: "All",
    isChecked: false,
  },
]


export default function PosteriorTagging({ navigation }) {

  const { recordingsPosterior, setRecordingsPosterior, PosteriorTagging, setPosteriorTagging, handlePosteriorfiltering, newlyCreatedPatientLungsId, newlyCreatedPatientId } = useContext(AddPatientContext)
  const { user } = useContext(AuthContext);

  const [currrentStep, setCurrentStep] = useState(3);

  const [alltagVisible, setallTagVisible] = useState(false)
  const [tags, settags] = useState(SymptomsData)
  const [activeLungsection, setActiveLungsection] = useState(null)
  const [showSoundsPopup, setShowSoundsPopup] = useState(false)
  const [showWarningPopup, setShowWarningPopup] = useState(false)
  const isFocused = useIsFocused()


  useEffect(() => {
    setShowWarningPopup(false)
  }, [isFocused])


  // const [recordingsPositions, setRecordingsPositions] = useState([
  //   {
  //     id: 1,
  //     lungs_tags: "p7_tag",

  //   },
  //   {
  //     id: 2,
  //     lungs_tags: "p8_tag",
  //   },
  //   {
  //     id: 3,
  //     lungs_tags: "p9_tag",

  //   },
  //   {
  //     id:4,
  //     lungs_tags: "p10_tag",

  //   },
  //   {
  //     id: 5,
  //     lungs_tags: "p11_tag",

  //   },
  //   {
  //     id: 6,
  //     lungs_tags: "p12_tag",

  //   }
  // ]);

  // const getPatientLungsDetail = async () => {
  //   try {
  //     var res = await LungXinstance.post(`api/lung_audio/`, { doctor_id: user.id, patient_id: newlyCreatedPatientId }, {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       }
  //     })
  //     if(res?.data?.length >0){
  //     var Data = res?.data?.[0]

  //     recordingsPositions.map((recordingLine, index) => {
  //       Data?.[recordingLine.lungs_tags] && JSON.parse(Data?.[recordingLine?.lungs_tags])?.options?.map(opt => {
  //         PosteriorTagging.map((postag) => {
  //           postag?.id === recordingLine?.id &&
  //           postag?.options?.map((option) => {
  //               if (option?.id === opt?.id) {
  //                 option.isChecked = true;
  //               }
  //             })
  //         })
  //       }
  //       )
  //     })
  //   }

  //   } catch (e) {
  //     console.log("Error...in posterior tagging...recording...", e)
  //   }
  // }

  // useEffect(() => {
  //   getPatientLungsDetail()
  // }, [])



  function getRecordingLines() {
    return recordingsPosterior?.map((recordingLine, index) => {
      return (
        <>
          <Pressable onPress={() => setActiveLungsection(recordingLine?.id)} style={[styles.button_wrapper, recordingLine.style]} key={(() => Math.random())()}>
            {activeLungsection == index + 7 && <Image style={{ ...styles.backimg, backgroundColor: "#fff", opacity: 0.13 }} source={testdel} />}

            {PosteriorTagging?.map((ele) =>
            (
              ele.id == index + 1 &&
              ele.options.map(option => (
                option.isChecked &&
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

  // recorded sound section

  const [currentSoundId, setCurrentSoundId] = useState(null);


  async function playSound(id) {
    try {
      if (currentSoundId !== null) {
        console.log("current sound is not null")
        await stopSound();
      }
      const sound = recordingsPosterior.find((recording) => recording.id === id).sound;
      if (sound) {
        await sound.playAsync();
        setCurrentSoundId(id);
      } else {
        console.log('No sound found.')
      }
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
          {ele?.sound && <Text >{currentSoundId == ele.id ? <Text key={(() => Math.random())()}>&#9654; stop</Text> : <Text key={(() => Math.random())()}>&#9654; play</Text>}</Text>}
        </Pressable>
      );
    });
  }

  const handleTaggingAllAnteriorPosition = (symptomsName, state) => {
    const newtag = tags.map((symptoms) => {
      if (symptoms.position === symptomsName && state) return { ...symptoms, isChecked: true };
      if (symptoms.position === symptomsName && !state) return { ...symptoms, isChecked: false };
      return symptoms;
    });
    settags(newtag);

    const newAnteriorTagging = PosteriorTagging.map((position) => {
      const newAnteriorOption = position.options.map((symptoms) => {
        if (symptoms.position === symptomsName && state) return { ...symptoms, isChecked: true };
        if (symptoms.position === symptomsName && !state) return { ...symptoms, isChecked: false };
        return symptoms;
      });
      return { ...position, options: newAnteriorOption };
    });
    setPosteriorTagging(newAnteriorTagging);
  };

  const handleTagDiscarding = () => {
    const newtags = tags.map(
      symptoms => {
        return { ...symptoms, isChecked: false }
      }

    )
    settags(newtags)
    const newAnteriorTagging = PosteriorTagging.map((position) => {
      const newOptions = position.options.map((option) => {
        return { ...option, isChecked: false };
      });
      return { ...position, options: newOptions };
    });
    setPosteriorTagging(newAnteriorTagging);
  };


  //Anterior Tagging controller runs on  input changes (checkboxes)

  const handleAnteriorPositionTagging = (positionid, optionid, state) => {
    console.log("handleAnteriorPositionTagging---positionid----------------------a-----")
    // console.log(positionid)
    console.log("handleAnteriorPositionTagging----optionid------------------------b---")
    // console.log(optionid)
    // console.log(state)

    const newAnteriorTagging = PosteriorTagging.map((position) => {
      if (position.id === positionid && optionid != 6) {
        const newOptions = position.options.map((option) => {
          if (option.id === optionid) {
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
          if (state) {
            return { ...option, isChecked: true };
          }
          return option;
        });
        return { ...position, options: newOptions };
      }
      return position;
    });
    setPosteriorTagging(newAnteriorTagging);
  };

  //Anterior Tagging controller runs on submit all inputs (checkboxes)

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
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          width: 130,
                        }}
                      >
                        <View
                          style={{ alignItems: "center", flexDirection: "row" }}
                        >
                          <RadioButton.Android
                            style={{ backgroundColor: '#fff' }}
                            status={symptom.isChecked ? 'checked' : 'unchecked'}
                            tintColors={{ true: colors.green, false: "grey" }}
                            onPress={(state) => { handleAnteriorPositionTagging(position.id, symptom.id, state) }}
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

        <View style={{ width: metrics.screenWidth * 0.9, flexDirection: 'row', justifyContent: 'space-between', marginTop:10 }}>
          <TouchableOpacity onPress={() => setallTagVisible(!alltagVisible)}>
            <Text style={commonStyle.btn3}>Tag total lungs</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTagDiscarding()}>
            <Text style={commonStyle.btn3} color={colors.red} size={fonts.font12}>Discard Tags</Text>
          </TouchableOpacity>
        </View>


        {
          alltagVisible && (
            <View style={{ marginTop:10 }}>
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
                  {tags.length > 0 && tags.map((symptom, index) => (
                    <View key={(() => Math.random())()}
                      style={{
                        alignItems: "flex-start",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        width: 130,
                      }}
                    >
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <RadioButton.Android
                          style={{ backgroundColor: '#fff' }}
                          status={symptom.isChecked ? 'checked' : 'unchecked'}
                          tintColors={{ true: colors.green, false: "grey" }}
                          onPress={(state) => { handleTaggingAllAnteriorPosition(symptom.position, state) }}
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
          )
        }


        {/* lungsPosterior image and activeLungsection selector buttons */}

        {/* <View style={{ width: metrics.screenWidth * 0.9,marginBottom:40 }}>
        <Text style={commonStyle.btn3}>Click to Select Positions</Text>
      </View> */}

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
            flexDirection:'row',
            justifyContent: 'space-between',
            flex: 1,
            marginTop: 20,
            width:"97%",
          }}
        >
          <View style={{ width: metrics.screenWidth * 0.43,left:5 }}>
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
          </View>

          <View style={{ width: metrics.screenWidth * 0.49, }}>
            <Button.BtnContain
              label="Continue to report"
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
          <Pressable onPress={() => setShowSoundsPopup(false)}>
            <Text style={listenRecordingsStyle.btn}>Close</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal visible={showWarningPopup} contentContainerStyle={containerStyle} onDismiss={() => setShowWarningPopup(false)}>
        <View style={warningStyle.main}>
          <Text style={warningStyle.title}>Confirm</Text>
          <Text style={warningStyle.title2}>Continue to Tag Posterior ?</Text>
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
    width: metrics.screenWidth*0.9,
    padding: 10,
    marginLeft:15
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
    color: "green",
    borderRadius: 4,
    display: "flex",
    alignSelf: "flex-start",
    marginVertical: 8

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
    fontSize: 18,
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
