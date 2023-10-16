import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SubTitle, Title } from '../components/Atoms/Typography';
import metrics from '../constants/layout';
import fonts from '../constants/fontsSize';
import Textinput from '../components/Atoms/Textinput';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import colors from '../constants/colors';
import Checkbox from 'expo-checkbox';
import LungXinstance from '../api/server';
import { lungs, lungsPosterior } from '../context/AddPatientContext';
import { Audio } from 'expo-av';
import LoadingScreen from '../components/Atoms/LoadingScreen';


export default function ReportReceivedScreen({ navigation, route }) {

  const sound = new Audio.Sound()
  const ShareDataId = route?.params?.ShareDataId;

  const [loading, setLoading] = useState(true);

  const [patientData, setPatientData] = useState("");
  const [patientHealthData, setPatientHealthData] = useState([]);
  const [lungAudioData, setLungAudioData] = useState([]);
  const [doctorData, setDoctorData] = useState("");

  const [showVitals, setShowVitals] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showOverallReport, setShowOverallReport] = useState(false);

  const [currentSoundId, setCurrentSoundId] = useState(null);


  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Received Report',
      headerTitleStyle: {
        color: colors.red,
        fontFamily: 'Montserrat-Medium',
        fontSize: 18,
      },

      headerTintColor: colors.red,
      headerLeft: () => (
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialIcons name="arrow-back" size={25} color={colors.black} />
          </TouchableOpacity>
        </View>
      ),
    }, [navigation]);
  })

  const handleViewPatientData = async () => {
    try {
      const res = await LungXinstance.get(`/api/view-patient-data/${ShareDataId}/`)
      setPatientData(res.data?.patient)
      setPatientHealthData(res.data?.patienthealthdata)
      setLungAudioData(res.data?.lung_audio)
      handleDoctorData(res.data?.patient?.doctor)
    } catch (e) {
      setLoading(false)
      console.log("Error...handleViewPatientData in report received", e)
    }
  }

  useEffect(() => {
    handleViewPatientData()
  }, [])

  const handleDoctorData = async (doctorId) => {
    try {
      const res = await LungXinstance.get(`/api/doctors/${doctorId}/`)
      setDoctorData(res.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log("Error...handleDoctorData in report received", e)
    }
  }

  const PatientGenderCard = ({ gender }) => (
    <View style={{ marginVertical: 10 }}>
      <Title color={colors.black} size={fonts.font12}>
        Gender
      </Title>
      <View
        style={[
          styles.PatientSelectionContainer,
          { width: metrics.screenWidth * 0.45, },
        ]}>
        <View style={{ alignItems: 'center', flexDirection: 'row', }}>
          <Checkbox tintColors={{ true: colors.green, false: 'black' }}
            value={gender == 'male'}
          />
          <SubTitle size={fonts.font12}>Male</SubTitle>
        </View>

        <View style={{ alignItems: 'center', flexDirection: 'row', }}>
          <Checkbox tintColors={{ true: colors.green, false: 'black' }}
            value={gender === 'female'}
          />
          <SubTitle size={fonts.font12}>Female</SubTitle>
        </View>
      </View>
    </View>
  );


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


  const VitalsContainer = () => (
    <View style={styles.PatientDetailsContainer}>

      <TouchableOpacity disabled>
        <View style={{ flexDirection: 'row', }}>
          <View>
            <Title color={colors.green} >{'Vitals'}</Title>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowVitals(!showVitals);
              }}>
              {showVitals ?
                <MaterialCommunityIcons
                  name="minus"
                  size={fonts.font26}
                  color={colors.green}
                />
                :
                <MaterialCommunityIcons
                  name="plus"
                  size={fonts.font22}
                  color={colors.green}
                />
              }
            </TouchableOpacity>
          </View>
        </View>

        {showVitals ? (
          <>
            <View style={{ flexDirection: 'row', marginVertical: 10, marginTop: 20 }}>
              <View style={{ flex: 0.8, }}>
                <Title size={fonts.font12}>
                  Temperature (C)
                </Title>
              </View>
              <View style={{ flex: 0.1, alignItems: 'center', }}>
                <Title size={fonts.font12}>:</Title>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end', }}>
                <Title size={fonts.font12}>{patientHealthData?.[0]?.temperature}</Title>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 0.8 }}>
                <Title size={fonts.font12}>
                  Oxygen saturation (SpO2)
                </Title>
              </View>
              <View style={{ flex: 0.1, alignItems: 'center' }}>
                <Title size={fonts.font12}>:</Title>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                <Title size={fonts.font12}>{patientHealthData?.[0]?.oxygen_saturation + "%"}</Title>
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginVertical: 10 }}>
              <View style={{ flex: 0.8 }}>
                <Title size={fonts.font12}>
                  Blood Pressure (mm/hg)
                </Title>
              </View>
              <View style={{ flex: 0.1, alignItems: 'center', }}>
                <Title size={fonts.font12}>:</Title>
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                <Title size={fonts.font12}>{patientHealthData?.[0]?.blood_pressure}</Title>
              </View>
            </View>
          </>
        )
          : null}
      </TouchableOpacity>
    </View>
  );

  const ComplaintsContainer = () => (
    <View style={styles.PatientDetailsContainer}>
      <TouchableOpacity disabled>
        <View style={{ flexDirection: 'row', }}>
          <View>
            <Title color={colors.green} >{'Complaints'}</Title>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowComplaints(!showComplaints);
              }}>
              {showComplaints ?
                <MaterialCommunityIcons
                  name="minus"
                  size={fonts.font26}
                  color={colors.green}
                />
                :
                <MaterialCommunityIcons
                  name="plus"
                  size={fonts.font22}
                  color={colors.green}
                />
              }
            </TouchableOpacity>
          </View>
        </View>

        {showComplaints ? (
          <>
            <View>
              <View style={styles.containerHeading}>
                <SubTitle size={fonts.font12} >{'Chief Complaints'}</SubTitle>
              </View>

              {patientHealthData?.[0]?.chief_complaints?.length > 0 ?
                JSON.parse(patientHealthData?.[0]?.chief_complaints).map((item, index) => (
                  <View key={(() => Math.random())()} style={styles.symptomsDetails}>
                    <View style={{ flex: 0.35 }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {item.title}
                      </Title>
                    </View>
                    <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        Since :
                      </Title>
                    </View>
                    <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {
                          item?.options ? item?.options.map(ele => {
                            if (ele?.isChecked) {
                              return ele?.title
                            }
                          }) : item?.option
                        }
                      </Title>
                    </View>
                  </View>
                ))
                : <></>}
            </View>

            <View style={{ marginTop: 5 }}>
              <View style={styles.containerHeading}>
                <SubTitle size={fonts.font12} >{'Chronic Disease'}</SubTitle>
              </View>

              {patientHealthData?.[0]?.chronic_diseases?.length > 0 ?
                JSON.parse(patientHealthData?.[0]?.chronic_diseases).map((item, index) => (
                  <View key={(() => Math.random())()} style={styles.symptomsDetails}>
                    <View style={{ flex: 0.35 }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {item.title}
                      </Title>
                    </View>
                    <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        Since :
                      </Title>
                    </View>
                    <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {
                          item?.options ? item?.options.map(ele => {
                            if (ele?.isChecked) {
                              return ele?.title
                            }
                          }) : item?.option
                        }
                      </Title>
                    </View>
                  </View>
                ))
                : <></>}
            </View>

            <View style={{ marginTop: 5 }}>
              <View style={styles.containerHeading}>
                <SubTitle size={fonts.font12} >{'Lifestyle Habits'}</SubTitle>
              </View>

              {patientHealthData?.[0]?.lifestyle_habits?.length > 0 ?
                JSON.parse(patientHealthData?.[0]?.lifestyle_habits).map((item, index) => (
                  <View key={(() => Math.random())()} style={styles.symptomsDetails}>
                    <View style={{ flex: 0.35 }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {item.title}
                      </Title>
                    </View>
                    <View style={{ flex: 0.3, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        Since :
                      </Title>
                    </View>
                    <View style={{ flex: 0.33, alignItems: "flex-end" }}>
                      <Title color={colors.black} size={fonts.font10}>
                        {
                          item?.options ? item?.options.map(ele => {
                            if (ele?.isChecked) {
                              return ele?.title
                            }
                          }) : item?.option
                        }
                      </Title>
                    </View>
                  </View>
                ))
                : <></>}
            </View>

          </>
        )
          : null}
      </TouchableOpacity>
    </View>
  );

  const OverallReportContainer = () => (
    <View style={styles.PatientDetailsContainer}>
      <TouchableOpacity disabled>
        <View style={{ flexDirection: 'row', }}>
          <View>
            <Title color={colors.green} >{'Overall Report'}</Title>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowOverallReport(!showOverallReport);
              }}>
              {showOverallReport ?
                <MaterialCommunityIcons
                  name="minus"
                  size={fonts.font26}
                  color={colors.green}
                />
                :
                <MaterialCommunityIcons
                  name="plus"
                  size={fonts.font22}
                  color={colors.green}
                />
              }
            </TouchableOpacity>
          </View>
        </View>

        {showOverallReport ? (
          <>
            <View>
              <View style={styles.containerHeading}>
                <SubTitle size={fonts.font12} >{' Anterior Recordings and Tags'}</SubTitle>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 10 }}>
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

            <View style={{ marginTop: 15 }}>
              <View style={styles.containerHeading}>
                <SubTitle size={fonts.font12} >{' Posterior Recordings and Tags'}</SubTitle>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, width: wp("80%"), marginBottom: -15, marginTop: 10 }}>
                <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Right</Text>
                <Text style={{ fontSize: 11, color: "#D22B2B", fontWeight: "700" }}>Left</Text>
              </View>
              <View style={lungs.wrapper}>
                <View style={lungs.btn_wrapper}>
                  {getPosteriorRecordingLines()}
                </View>
                <Image style={lungs.img}
                  source={require("../assets/images/posterior_crop.png")}
                />
              </View>
            </View>
          </>
        )
          : null}
      </TouchableOpacity>
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
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()} onPress={() => playSound(lungAudioData?.[0]?.[recordingLine?.lungs_audio], recordingLine?.id)}>
            {lungAudioData?.[0]?.[recordingLine?.lungs_audio] && <Text style={styles.play_stop} >{currentSoundId == index ? <Text style={styles.btn_text}>&#9208;</Text> : <Text style={styles.btn_text}>&#9654;</Text>}</Text>}
            {
              lungAudioData?.[0]?.[recordingLine.lungs_tags] && JSON.parse(lungAudioData?.[0]?.[recordingLine?.lungs_tags])?.options?.map(res =>
                <Text key={(() => Math.random())()} style={{ ...lungs.tags, color: res?.id == 5 ? colors.black : "#990099" }}>{res?.position}</Text>
              )
            }
          </Pressable>
        </>
      );
    });
  }

  function getPosteriorRecordingLines() {
    return posteriorrecordings.map((recordingLine, index) => {
      return (
        <>
          <Pressable style={[recordingLine.style, styles.button_wrapper]} key={(() => Math.random())()} onPress={() => playSound(lungAudioData?.[0]?.[recordingLine?.lungs_audio], recordingLine?.id)} >
            {lungAudioData?.[0]?.[recordingLine?.lungs_audio] && <Text style={styles.play_stop} >{currentSoundId == recordingLine?.id ? <Text style={styles.btn_text}>&#9208;</Text> : <Text style={styles.btn_text}>&#9654;</Text>}</Text>}
            {
              lungAudioData?.[0]?.[recordingLine.lungs_tags] && JSON.parse(lungAudioData?.[0]?.[recordingLine?.lungs_tags])?.options?.map(res =>
                <Text key={(() => Math.random())()} style={{ ...lungs.tags, color: res?.id == 5 ? colors.black : "#990099" }}>{res?.position}</Text>
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

      <View style={styles.InfoContainer}>
        {doctorData?.user?.name &&
          <SubTitle size={fonts.font12}>Doctor Name : {doctorData?.user?.name}</SubTitle>
        }

        {doctorData?.profile_id &&
          <SubTitle size={fonts.font12}>Doctor ID : {doctorData?.profile_id}</SubTitle>
        }

        {doctorData?.doc_dept &&
          <SubTitle size={fonts.font12}>Speciality : {doctorData?.doc_dept}</SubTitle>
        }

        {doctorData?.hospital &&
          <SubTitle size={fonts.font12}>
            Hospital Name : {doctorData?.hospital}
          </SubTitle>
        }

        <View style={{ alignItems: 'flex-end', marginTop: 10, marginBottom: 10 }}>
          <Title >Patient Status: {patientData?.in_patient ? "In-patient" : "Out-patient"}</Title>
        </View>
      </View>

      <Textinput label={'Patient name'} editable={false} value={patientData?.patient_name} />
      <Textinput label={'Patient ID'} editable={false} value={patientData?.patient_code} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: metrics.screenWidth * 0.9,
        }}>
        <Textinput width={metrics.screenWidth * 0.43} editable={false} label="Age" value={patientHealthData?.[0]?.age} />
        <PatientGenderCard gender={patientHealthData?.[0]?.gender} />
      </View>

      <Textinput label="Weight (kg)" editable={false} value={patientHealthData?.[0]?.weight} />


      <VitalsContainer />

      <ComplaintsContainer />

      <OverallReportContainer />

      <Textinput label={"Diagnosis Notes"} editable={false} value={patientHealthData?.[0]?.diagnosis_notes} multiline={true} height={75} />

      <Textinput label={"Additional Notes"} editable={false} value={patientHealthData?.[0]?.additional_notes} multiline={true} height={75} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  InfoContainer: {
    width: metrics.screenWidth * 0.9,
    marginTop: 10
  },
  PatientDetailsContainer: {
    width: metrics.screenWidth * 0.9,
    paddingVertical: 15,
    marginVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
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
    height: 55
  },
  containerHeading: {
    backgroundColor: "#F6FBF9",
    width: metrics.screenWidth * 0.88,
    marginHorizontal: -20,
    alignSelf: 'center',
    paddingHorizontal: 15,
    marginVertical: 20,
    borderRadius: 7

  },
  wrapper: {
    position: "relative",
    width: wp("80%"),
    aspectRatio: 8 / 9,

  },
  img: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,

  },
  btn_wrapper: {
    width: "100%",
    height: "100%",
    aspectRatio: 8 / 9,
    zIndex: 10
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
  },
  symptomsDetails: {
    display: "flex",
    flexDirection: "row",
    width: metrics.screenWidth * 0.8,
    marginVertical: 5,
    alignItems: "center",
    borderRadius: 8,
    padding: 7,
  },
});