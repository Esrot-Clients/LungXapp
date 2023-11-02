import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import metrics from '../constants/layout';
import * as Typography from '../components/Atoms/Typography';
import colors from '../constants/colors';
import fonts from '../constants/fontsSize';
import DropdownComponent from '../components/Molecules/Dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';
import LungXinstance from '../api/server';
import { AddPatientContext } from '../context/AddPatientContext';


const data = [
  { label: 'Out-patient', value: 'Out-patient' },
  { label: 'In-patient', value: 'In-patient' },
];

export default function InPatientSessionsDetailsScreen({ navigation, route }) {
  const [showSessionCard, setShowSessionCard] = useState(false);
  const { resetStateObj } = useContext(AddPatientContext);
  const focused = useIsFocused()


  const { id } = route?.params?.item;

  const PatientDetailsCard = ({ showView = false }) => {
    return (
      <View style={styles.PatientDetailsContainer}>
        <TouchableOpacity disabled>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: "100%" }}>
              <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Typography.Title>Patient ID : </Typography.Title>
                <Typography.Title>{patientDetail?.[0]?.patient_code}</Typography.Title>
              </View>
              {/* <Typography.Title>Patient ID : {patientDetail?.[0]?.patient_code}</Typography.Title> */}
              <View style={{ height: 3 }} />
              <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <Typography.Title>Patient Name :</Typography.Title>
                <Typography.Title> {patientDetail?.[0]?.patient_name}</Typography.Title>
              </View>
            </View>
            {showView ? (
              <View
                style={{
                  alignItems: 'flex-end',
                  flex: 1,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => { }}>
                  <Typography.Title color={colors.green}>View</Typography.Title>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // get patient detail start
  const [patientDetail, setPatientDetail,] = useState(null)

  const getPatientDetail = async () => {
    return LungXinstance.post(`api/patients/`, { id }, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res => { setPatientDetail(res.data) }).catch(err => err)
  }
  // get patient detail end
  useEffect(() => {
    // getPatientLungsDetail()
    getPatientDetail()
  }, [focused, id])

  const [dayAndSessionFilter, setDayAndSessionFilter] = useState([{}])

  useEffect(() => {
    let dates = []
    let dateSession = []
    patientDetail?.[0]?.patienthealthdata.forEach(ele => {
      let day = new Date(ele.created_at).getDate()
      let month = new Date(ele.created_at).getMonth() + 1;
      let year = new Date(ele.created_at).getFullYear()
      const date = day + "-" + month + "-" + year
      dates = [...dates, date]
    })
    dates = [...new Set(dates)]

    patientDetail?.[0]?.patienthealthdata.forEach((ele, indexx) => {
      let day = new Date(ele.created_at).getDate()
      let month = new Date(ele.created_at).getMonth() + 1;
      let year = new Date(ele.created_at).getFullYear()
      const date = day + "-" + month + "-" + year
      dates.forEach((dateStr, index) => {
        if (dateStr == date) {
          if (dateSession?.[index]) {
            dateSession[index] = { date, session: [...dateSession?.[index]?.session, { session: ele }] }
          } else {
            dateSession[index] = { date, session: [{ session: ele }] }
          }
        }
      })

    })
    // console.log("data....in useEffect dateSession",dateSession)
    setDayAndSessionFilter(dateSession)

  }, [patientDetail])



  const DailyReportContainer = (props) => (

    <View style={styles.PatientDetailsContainer}>
      <TouchableOpacity disabled>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Typography.Title>Day {props?.arr.length - props?.index}</Typography.Title>
            <View style={{ height: 3 }} />
            <Typography.SubTitle>Date : {props?.date}</Typography.SubTitle>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              flex: 1,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowSessionCard(!showSessionCard);
              }}>
              {showSessionCard ?
                <MaterialCommunityIcons
                  name="minus"
                  size={fonts.font26}
                  color={colors.green}
                />
                :
                <MaterialCommunityIcons
                  name="plus"
                  size={fonts.font26}
                  color={colors.green}
                />}
            </TouchableOpacity>
          </View>
        </View>
        {showSessionCard ? (
          <>
            {props?.session.map((item, sessionNo) => (
              <View style={{ flexDirection: 'row' }} key={(() => Math.random())()}>
                <View style={{ marginVertical: 10 }}>
                  <Typography.Title size={fonts.font12}>
                    {item?.session?.session}
                  </Typography.Title>
                  <View style={{ height: 1 }} />
                  <Typography.SubTitle>Time : {new Date(item?.session?.created_at).getHours()}:{new Date(item?.session?.created_at).getMinutes()}</Typography.SubTitle>
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  {item?.session?.status == true ?
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('In Patient Details Session', { item: patientDetail?.[0], detailItem: item })
                      }}>
                      <Typography.Title size={fonts.font12} color={colors.green} >
                        View
                      </Typography.Title>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      onPress={() => {
                        resetStateObj();
                        // navigation.navigate('In Patient Details Session', { item: patientDetail?.[0], detailItem: item })
                        navigation.navigate("Add Patient", { existedPatientId: patientDetail?.[0]?.id, session: item?.session?.session, existedPatientHealthId: item?.session?.id, existedSessionCreatedData:item?.session?.created_at })
                      }}>
                      <Typography.Title size={fonts.font12} color={colors.green} >
                        Edit
                      </Typography.Title>
                    </TouchableOpacity>
                  }
                </View>
              </View>
            ))}
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    alignItems: 'flex-end',
                    flex: 1,
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(patientDetail?.[0]?.id)
                      // console.log(props?.session.length)
                      resetStateObj()
                      if (new Date(patientDetail[0].patienthealthdata[0].created_at).getDate() == new Date().getDate()) {
                        navigation.navigate("Add Patient", { existedPatientId: patientDetail?.[0]?.id, session: props?.session.length })
                      } else {
                        navigation.navigate("Add Patient", { existedPatientId: patientDetail?.[0]?.id, session: 0 })
                      }

                    }}>
                    <Typography.Title size={fonts.font12} color={colors.green}>
                      Add Session
                    </Typography.Title>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </TouchableOpacity>
    </View>
  );


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PatientDetailsCard />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <View style={{ marginHorizontal: 10, marginVertical:10 }}>
          <Typography.Title color={colors.black} size={fonts.font12}>
            Choose Patient Status :
          </Typography.Title>
        </View>
        {/* <DropdownComponent
          dropdowndata={data}
          width={metrics.screenWidth / 2.6}
          onDropdownChange={() => { }}
          placeholder="Status"
          value={'In-patient'}
        /> */}
        <Typography.Title color={colors.green} size={fonts.font14}>
          In-Patient 
          </Typography.Title>
      </View>

      {dayAndSessionFilter.length > 0 && dayAndSessionFilter.map((item, index, arr) => (
        <View key={(() => Math.random())()}>
          <DailyReportContainer {...item} index={index} arr={arr} />
        </View>
      ))}

      <View>
        <TouchableOpacity onPress={() => { }}>
          {/* <Typography.Title color={colors.green}>View</Typography.Title> */}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20
  },
  PatientDetailsContainer: {
    width: metrics.screenWidth * 0.9,
    paddingVertical: 15,
    marginVertical: 5,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
  },
});
