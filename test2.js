import { StyleSheet, ScrollView, Text, View, Button, Image, Pressable } from "react-native";
import React, { useState, useEffect, useRef,useContext } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { lungs } from "../context/AddPatientContext";
import testdel from "./../../assets/testdel.png"

import ProgressSteps, {
  Title,
  Content,
} from "@joaosousa/react-native-progress-steps";

import * as button from "../components/Atoms/Button";
import metrics from "../constants/layout";
import colors from "../constants/colors";

import { Audio } from "expo-av";
import { AddPatientContext } from "../context/AddPatientContext";
import * as Sharing from 'expo-sharing';
import LungXinstance from "../api/server";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// import RadialGradient50 from "../components/Atoms/RadialGradient";

const steps = [
  {
    id: 1,
    title: <Title>Anterior</Title>,
  },
  {
    id: 2,
    title: <Title>Posterior</Title>,
  },
  {
    id: 3,
    title: <Title>Tag Anterior</Title>,
  },
  {
    id: 4,
    title: <Title>Tag Posterior</Title>,
  },
  {
    id: 5,
    title: <Title>Report</Title>,
  },
];

export default function AnteriorRecording({ navigation }) {
  const orientations = ["vertical", "horizontal"];
  const [currrentStep, setCurrentStep] = useState(0);
  const recordingRef = useRef();

  const [isRecording,setIsRecording]=useState(false)
  const [btnState,setBtnState]=useState([
    null,null,null,null,null,null,null
  ])
  const [message, setMessage] = useState("");
  const [recordingTimeout, setRecordingTimeout] = useState(null);
  const [recordText, setRecordText] = useState("");
  const [currentSoundId, setCurrentSoundId] = useState(null);
  const [portionOnFocus,setPortionOnFocus]=useState(null)
  const [isPlaying,setIsPlaying]=useState(false)
  const [isFoucued,setIsFoucued]=useState(false)
  const {recordings,setRecordings,patientid,newlyCreatedPatientId,newlyCreatedPatientLungsId,setNewlyCreatedPatientLungsId,sessionNo}=useContext(AddPatientContext)
  const { user } = useContext(AuthContext);

  const payload=new FormData()
  let file="dfg"

  async function convert_Url_Blob_File(url){
    try {
      let blob = await fetch(url).then(res => res.blob())
      const file=new File([blob],url,{type:blob.type})
      return blob
    } catch (error) {
      console.log(error)
    }
  }
  

 async function handlePatientAnteriorRecordings(){




   recordings.forEach(async(ele,index)=>{
     if(ele.file!="" ){
       file=await convert_Url_Blob_File(ele.file)
      
    }

    if(index==6){

      try {
        setTimeout(async()=>{
          // if(newlyCreatedPatientLungsId==null){
          if(false){
            payload.append("patient",newlyCreatedPatientId) 
            payload.append("doctor",user?.id) 
            sessionNo && payload.append("session","session "+sessionNo) 
            const res=await LungXinstance.put("/api/lung_audio/",payload,{
              headers: {
                'content-type': 'multipart/form-data'
              }  
            })
          // console.log(res.data)
            setNewlyCreatedPatientLungsId(res?.data?.id)
          }else{
              payload.append("photo",file)

            await axios.post("http://10.0.2.2:3000/upload",{photo:file},{
              headers: {
                'content-type': 'multipart/form-data'
              } 
            }).then(res=>console.log(res?.data))
            return 







            payload.append("patient",9) 
            payload.append("doctor_id",user?.id) 
            payload.append("id",49) 
            payload.append("p8_tag","vdfv") 
            console.log("first-------")
            // console.log([{...payload}])

            // payload.append("patient",newlyCreatedPatientId) 
            // payload.append("doctor_id",user?.id) 
            // payload.append("id",newlyCreatedPatientLungsId) 
            sessionNo && payload.append("session","session "+sessionNo) 
            // console.log(payload)
            try {
               LungXinstance.patch("/api/lung_audio/",payload,{
                headers: {
                  'content-type': 'multipart/form-data'
              }  
            }).then(res=>console.log(res)).catch(err=>console.log(err))
            // }).then(res=>setNewlyCreatedPatientLungsId(res?.data?.id)).catch(err=>console.log(err))
            
              
            } catch (error) {
              console.log(error)
            }
          }
          // navigation.navigate("Posterior Recording");
        },2000)
        
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
      const sound = recordings.find((recording) => recording.id === id).sound;
      // const file = recordings.find((recording) => recording.id === id);

      // if(file){
        // alert(file)
        // Sharing.shareAsync(file)
        // upload(file)
      // }
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
      const recordingLine = recordings.find(
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

  async function startRecording(id) {
    try {
      const permission = await Audio.requestPermissionsAsync();
      // check if we are already reorcing or not
      if(isRecording) return setMessage("Already Recording");
      // check for permission of recording
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        // changing the button state from null to start recoding 
        btnState[id]="recording"
        setBtnState(btnState)
        // recording 
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
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
            setIsRecording(false)
            stopRecording(id);
          }, 10000)
        );
      } else {
        setMessage("Please grant permission to app to access the microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
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
          const updatedRecordings = [...recordings];
          updatedRecordings.push({
            id: recordings.length + 1,
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
          });

          setRecordings(updatedRecordings);
          setMessage("");
        } else {
          recordings.forEach((recordingss, index) => {
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
    return recordings.map((recordingLine, index) => {
      return (
        <>
        
          {
            recordingLine.sound==="" ?
            <>
                  <Pressable  key={(()=>Math.random())()}
                  disabled={ isPlaying || (isRecording && portionOnFocus!==recordingLine.id)}
                   style={[styles.button_wrapper,recordingLine.style]}
                    onPress={() =>!isRecording?startRecording(recordingLine.id):(()=>{setIsRecording(false);stopRecording(recordingLine.id)})()}
                    >
                    {btnState[index] && <Image style={styles.backimg} source={testdel}/>} 
                    {btnState[index] && 
                      <View style={styles.state}>
                        <View style={styles.outerCircle}>
                          <View style={styles.innerCircle}>
                          </View>
                        </View>
                        <Text style={styles.recordingText}>Rec</Text>
                      </View>
                      }
                  </Pressable>
            
            </>
            :
            <>
                    <Pressable disabled={isRecording} onPress={() => toggleSound(index)}  style={[recordingLine.style,styles.button_wrapper]} key={(()=>Math.random())()}>
                    {portionOnFocus == index && <Image style={styles.backimg} source={testdel}/>}
                    <View
                      style={styles.state}
                    >
                        <Text style={styles.recordingText}>{currentSoundId === index ?<><Text>&#9654; stop</Text></>  : <Text>&#9654; play</Text>}</Text>
                        
                    </View>
                  
                  </Pressable>

            </>
          }
        </>
      );
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ height: 100, width: metrics.screenWidth }}>
        <ProgressSteps
          steps={steps}
          currentStep={currrentStep}
          orientation={"horizontal"}
          onStepChange={setCurrentStep}
        />
      </View>

  {/* <Text>{isRecording+""}</Text> */}
  {/* <Text>{portionOnFocus}</Text> */}
  {/* <Text>{isPlaying+""}</Text> */}
  {/* <Text>{!btnState[portionOnFocus]+""}</Text> */}

                          
      <View style={rereording.recordingWrapper}>
        <Text  style={rereording.recordingPosition}>Position : {portionOnFocus}</Text>
        <Pressable style={rereording.reRecording} disabled={isRecording || !isFoucued || isPlaying || !btnState[portionOnFocus]} onPress={()=>startRecording(portionOnFocus)}>
          <Text style={(isRecording || !isFoucued || isPlaying || !btnState[portionOnFocus])?rereording.reRecordingActive:rereording.reRecordingText}>re-recording</Text>
        </Pressable>
      </View>


      <View style={lungs.wrapper}>
        <View style={lungs.btn_wrapper}>
          {getRecordingLines()}
        </View>

      <Image  style={lungs.img}
        source={require("../assets/images/anterior_guide_crop_old.png")}
        />
      </View>

      <View
        style={{
          marginBottom: 30,
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
          marginTop: 20
        }}
      >
        <View style={{ width: metrics.screenWidth * 0.5 }}>
          <button.BtnContain
            label="Posterior"
            color={colors.green}
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
    // marginVertical: 15,
    alignItems: "center",
  },
  backimg:{
    position:"absolute",
    height:"100%",
    width:"100%",

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
  button_wrapper:{
    display:"flex",
    alignContent:"center",
    justifyContent:"center",
 
  },
  button1: {
    borderWidth:1,
    borderColor:"white",
    display:"flex",
    alignSelf:"center",
    flexDirection:"row",
    alignItems:"center"
  },
  state:{
    display:"flex",
    alignSelf:"center",
    flexDirection:"row",
    alignItems:"center",
    borderWidth:1,
    padding:1,
    paddingHorizontal:4,
    borderRadius:4,
    backgroundColor:"rgba(255,255,255,1)",
  },
  pressable_text:{
    color:"white"
  },
  outerCircle:{
    borderWidth:2,
    borderColor:"red",
    height:18,
    width:18,
    borderRadius:11,
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  innerCircle:{
    borderWidth:2,
    borderColor:"red",
    height:8,
    width:8,
    borderRadius:5
  },
  recordingText:{
    fontSize:14,
    paddingLeft:6,
    paddingBottom:1,
    fontWeight:600
  }
});

const rereording=StyleSheet.create({
  recordingWrapper:{
    display:"flex",
    borderColor:"rgba(0,0,0,.15)",
    borderWidth:1,
    width:"90%",
    margin:10,
    padding:20,
    flexDirection:"row",
    justifyContent:"space-between",
    borderRadius:10,
    fontSize:20,
    marginBottom:50,
    
  },
  recordingPosition:{
    fontSize:18,
  },
  reRecording:{
  },
  
  reRecordingActive:{
    color:"rgba(0,0,0,.6)",
    fontSize:18,
  },
  reRecordingText:{
    fontSize:18,
    color:"red"

  }
})



