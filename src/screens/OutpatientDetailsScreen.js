import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useContext, } from 'react';
import colors from '../constants/colors';
import { SubTitle, Title } from '../components/Atoms/Typography';
import metrics from '../constants/layout';
import fonts from '../constants/fontsSize';
import ComplaintsCard from '../components/Molecules/ComplaintsCard';
import Textinput from '../components/Atoms/Textinput';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Checkbox from 'expo-checkbox';
import LungXinstance from '../api/server';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { lungs, lungsPosterior } from '../context/AddPatientContext';
import { Audio } from 'expo-av';
import LoadingScreen from '../components/Atoms/LoadingScreen';

export default function OutPatientsDetailsScreen({ navigation, route }) {
  const [patientstatus, setpatientstatus] = useState('Out Patient');
  const { id } = route?.params?.item;
  const focused = useIsFocused()
  const { user } = useContext(AuthContext);
  const sound = new Audio.Sound()

  const [loading, setloading] = useState(true);

  const [patientDetail, setPatientDetail,] = useState(null)
  const [patientLungsDetail, setPatientLungsDetail,] = useState(null)
  

  const [recordings, setRecordings] = useState([
    {
      id: 0,
      style: lungs.btn0,
      lungs_audio: "p0_audio",
      lungs_tags: "p0_tag",
  
    },
    {
      id: 1,
      style: lungs.btn1,
      lungs_audio: "p1_audio",
      lungs_tags: "p1_tag",
    },
    {
      id: 2,
      style: lungs.btn2,
      lungs_audio: "p2_audio",
      lungs_tags: "p2_tag",
  
    },
    {
      id: 3,
      style: lungs.btn3,
      lungs_audio: "p3_audio",
      lungs_tags: "p3_tag",
  
    },
    {
      id: 4,
      style: lungs.btn4,
      lungs_audio: "p4_audio",
      lungs_tags: "p4_tag",
  
    },
    {
      id: 5,
      style: lungs.btn5,
      lungs_audio: "p5_audio",
      lungs_tags: "p5_tag",
  
    },
    {
      id: 6,
      style: lungs.btn6,
      lungs_audio: "p6_audio",
      lungs_tags: "p6_tag",
  
    },
  ]);

  const [posteriorrecordings, setPosteriorrecordings] = useState([
    {
      id: 7,
      style: lungsPosterior.btn7,
      lungs_audio: "p7_audio",
      lungs_tags: "p7_tag",
  
    },
    {
      id: 8,
      style: lungsPosterior.btn8,
      lungs_audio: "p8_audio",
      lungs_tags: "p8_tag",
    },
    {
      id: 9,
      style: lungsPosterior.btn9,
      lungs_audio: "p9_audio",
      lungs_tags: "p9_tag",
  
    },
    {
      id: 10,
      style: lungsPosterior.btn10,
      lungs_audio: "p10_audio",
      lungs_tags: "p10_tag",
  
    },
    {
      id: 11,
      style: lungsPosterior.btn11,
      lungs_audio: "p11_audio",
      lungs_tags: "p11_tag",
  
    },
    {
      id: 12,
      style: lungsPosterior.btn12,
      lungs_audio: "p12_audio",
      lungs_tags: "p12_tag",
  
    }
  ]);
  
  const [currentSoundId, setCurrentSoundId] = useState(null);
  
  const getPatientLungsDetail = async () => {
    return LungXinstance.post(`api/lung_audio/`, { doctor_id: user.id, patient_id: id }, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => setPatientLungsDetail(res.data)).catch(err => err)
  }

  const getPatientDetail = async () => {
    return LungXinstance.post(`api/patients/`, { id }, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => { setPatientDetail(res.data);setloading(false) }).catch(err => err)

  }
 

  useEffect(() => {
    getPatientLungsDetail()
    getPatientDetail()
  }, [focused, id])

 
  const PatientGenderCard = ({ gender }) => (
    <View style={{ marginVertical: 10 }}>
      <Title color={colors.black} size={fonts.font12}>
        Gender
      </Title>
      <View
        style={[
          styles.PatientSelectionContainer,
          { width: metrics.screenWidth * 0.43 },
        ]}>
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Checkbox tintColors={{ true: colors.green, false: 'black' }}
            value={gender == 'male'}
          />
          <SubTitle size={fonts.font12}>Male</SubTitle>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Checkbox tintColors={{ true: colors.green, false: 'black' }}
            value={gender === 'female'}
          />
          <SubTitle size={fonts.font12}>Female</SubTitle>
        </View>
      </View>
    </View>
  );


  async function playSound(track, id) {
    try {
      const uri = `https://lung.thedelvierypointe.com${track}`
      if (+currentSoundId === id) {
        setCurrentSoundId("no track")
        //  sound.stopAsync()
        sound.unloadAsync()

      } else {
        if (sound.isPlaying) {
          sound.stopAsync()
        }
        await sound.loadAsync({
          uri
        })
        await sound.playAsync();
        setCurrentSoundId(id);
      }
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  }

  useEffect(() => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setCurrentSoundId(null); 
      }
    });
  }, [sound]);


  function getAnteriorRecordingLines() {
    return recordings.map((recordingLine, index) => {
      var opt = ""
      if (patientLungsDetail?.[0]?.[recordingLine?.lungs_tags] == "{Normal}") {
        opt = "normal"
      }
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()} onPress={() => playSound(patientLungsDetail?.[0]?.[recordingLine?.lungs_audio], recordingLine?.id)}>
            {/* <Text>{patientLungsDetail?.[0]?.[recordingLine?.lungs_audio]}</Text> */}
            {patientLungsDetail?.[0]?.[recordingLine?.lungs_audio] && <Text style={styles.play_stop} >{currentSoundId == index ? <Text style={styles.btn_text}>&#9208;</Text> : <Text style={styles.btn_text}>&#9654;</Text>}</Text>}
            {opt == "" &&
              patientLungsDetail?.[0]?.[recordingLine.lungs_tags] && JSON.parse(patientLungsDetail?.[0]?.[recordingLine?.lungs_tags])?.options?.map(res =>
                <Text key={(() => Math.random())()} style={{...lungs.tags,  color:res?.id == 5? colors.black:"#990099"}}>{res?.position}</Text>
              )
            }
          </Pressable>
        </>
      );
    });
  }

  // posterior recor and tagging start
  function getPosteriorRecordingLines() {
    return posteriorrecordings.map((recordingLine, index) => {
      var opt = ""
      if (patientLungsDetail?.[0]?.[recordingLine?.lungs_tags] == "{Normal}") {
        opt = "normal"
      }
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()} onPress={() => playSound(patientLungsDetail?.[0]?.[recordingLine?.lungs_audio], recordingLine?.id)} >
            {patientLungsDetail?.[0]?.[recordingLine?.lungs_audio] && <Text style={styles.play_stop} >{currentSoundId == recordingLine?.id ? <Text style={styles.btn_text}>&#9208;</Text> : <Text style={styles.btn_text}>&#9654;</Text>}</Text>}
            {opt == "" &&
              patientLungsDetail?.[0]?.[recordingLine.lungs_tags] && JSON.parse(patientLungsDetail?.[0]?.[recordingLine?.lungs_tags])?.options?.map(res =>
                <Text key={(() => Math.random())()} style={{...lungs.tags,  color:res?.id == 5? colors.black:"#990099"}}>{res?.position}</Text>
              )
            }
          </Pressable>
        </>
      );
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {
        loading ? <LoadingScreen /> : null
      }
      <View style={{ alignItems: 'flex-end', width: metrics.screenWidth * 0.9 }}>
        <Title color="#000" size={fonts.font12}>Patient Status: {patientstatus}</Title>
      </View>

      <Textinput
        label={'Patient name'}
        editable={false}
        value={patientDetail?.[0]?.patient_name}
      />
      <Textinput label={'Patient ID'} editable={false} value={patientDetail?.[0]?.patient_code + ""} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: metrics.screenWidth * 0.9,
        }}>
        <Textinput width={metrics.screenWidth * 0.43} editable={false} label="Age" value={patientDetail?.[0]?.patienthealthdata?.[0]?.age + ""} />
        <PatientGenderCard gender={patientDetail?.[0]?.patienthealthdata?.[0]?.gender} />
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: metrics.screenWidth * 0.9,
        }}>
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Weight(kg)"
          editable={false}
          value={patientDetail?.[0]?.patienthealthdata?.[0]?.weight + ""}
        />
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Temperature(C)"
          editable={false}
          value={patientDetail?.[0]?.patienthealthdata?.[0]?.temperature + ""}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: metrics.screenWidth * 0.9,
        }}>
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Oxygen saturation(SpO2)"
          editable={false}
          value={patientDetail?.[0]?.patienthealthdata?.[0]?.oxygen_saturation + "%"}
        />
        <Textinput
          width={metrics.screenWidth * 0.43}
          label="Blood Pressure(mm/hg)"
          editable={false}
          value={patientDetail?.[0]?.patienthealthdata?.[0]?.blood_pressure + ""}
        />
      </View>

      {
        <ComplaintsCard edit={false}
          chiefComplaints={patientDetail?.[0]?.patienthealthdata?.[0]?.chief_complaints?.length > 0 ? JSON.parse(patientDetail?.[0]?.patienthealthdata?.[0]?.chief_complaints) : []}
          chronicDisease={patientDetail?.[0]?.patienthealthdata?.[0]?.lifestyle_habits?.length > 0 ? JSON.parse(patientDetail?.[0]?.patienthealthdata?.[0]?.chronic_diseases) : []}
          lifeStyle={patientDetail?.[0]?.patienthealthdata?.[0]?.chronic_diseases?.length > 0 ? JSON.parse(patientDetail?.[0]?.patienthealthdata?.[0]?.lifestyle_habits) : []} />
      }


      <View style={styles.symptomsDetails}>
      <View style={{ flexDirection: "row", display: "flex", width: "100%" }}>
        <Title color={colors.green} size={fonts.font12}>
          Anterior Recordings and Tags
        </Title>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 20 }}>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
        </View>
        <View style={lungs.wrapper}>
          <View style={lungs.btn_wrapper}>
            {getAnteriorRecordingLines()}
          </View>
          <Image style={lungs.img}
            source={require("../assets/images/anterior_guide_crop_old.png")}
          />
        </View>
      </View>

      {/* lungsPosterior image and activeLungsection selector buttons */}

      <View style={styles.symptomsDetails}>
      <View style={{ flexDirection: "row", display: "flex", width: "100%" }}>
        <Title color={colors.green} size={fonts.font12}>
          Posterior Recordings and Tags
        </Title>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 20 }}>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
          <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
        </View>
        <View style={lungsPosterior.wrapper}>
          <View style={lungsPosterior.btn_wrapper}>
            {getPosteriorRecordingLines()}
          </View>
          <Image style={lungsPosterior.img}
            source={require("../assets/images/posterior_crop.png")}
          />
        </View>
      </View>


      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Diagnosis Notes </Title>
      </View>

      <Textinput
        multiline={true}
        height={75}
        editable={false}
        value={patientDetail?.[0]?.patienthealthdata?.[0]?.diagnosis_notes}
      />
      <View style={{ width: metrics.screenWidth * 0.9, marginVertical: 15 }}>
        <Title color={colors.black}>Additional Notes </Title>
      </View>

      <Textinput
        multiline={true}
        editable={false}
        height={75}
        value={patientDetail?.[0]?.patienthealthdata?.[0]?.additional_notes}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 15,
  },
  symptomsDetails: {
    display: 'flex',
    flexDirection: 'row',
    width: metrics.screenWidth * 0.9,
    marginVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    padding: 10,
    paddingHorizontal: 30,
  },
  PatientSelectionContainer: {
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    fontSize: fonts.font12,
    color: colors.black,
    flexDirection: 'row',
  },
  symptomsDetails: {
    display: "flex",
    justifyContent: "center", alignItems: "center",
    width: metrics.screenWidth * 0.9,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.green,
    padding: 10,
    paddingHorizontal: 30,
  },
  button_wrapper: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",

  },
  play_stop: {
    position: "absolute",
    left: "50%",
  },
  btn_text: {
    fontSize: 30,
    color: "white"
  }
});
