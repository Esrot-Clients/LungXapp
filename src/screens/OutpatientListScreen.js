import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import React, { useEffect, useState,useContext } from 'react';

import PatientDetailsCard from '../components/Molecules/PatientDetailsCard';
import * as Button from '../components/Atoms/Button'
import colors from '../constants/colors';
import metrics from '../constants/layout';
import SearchBar from '../components/Molecules/SearchBar';
import LungXinstance from '../api/server';
import { useQuery } from 'react-query';
import patientListApi from '../api/patientList';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { AddPatientContext } from '../context/AddPatientContext';
// 
export default function OutpatientListScreen({ navigation }) {

  const focused = useIsFocused()
  const { resetStateObj } = useContext(AddPatientContext);

  const [data, setData] = useState([])
  const [dataFilter, setDataFilter] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [reverse, setReverse] = useState(false);


  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Received Report',
      headerTitleStyle: {
        color: colors.red,
        fontFamily: 'Montserrat-Medium',
        fontSize: 20,
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

  const getData = async () => {
    try {
      const res = await LungXinstance.get("/api/patients/")
      var d = res.data?.filter(ele => ele?.out_patient == true)
      setData(d)
      setDataFilter(d)
    } catch (e) {
      console.log("Error...getData in out patient", e)
    }
  }

  useEffect(() => {
    getData()
  }, [focused, refresh])

  const handleFiltering = async search => {
    var temp = dataFilter.filter(item => {
      return (
        item?.patient_code.toLowerCase().includes(search.toLowerCase()) ||
        item?.patient_name.toLowerCase().includes(search.toLowerCase())
      );
    });
    setData(temp);
    setRefresh(true)
  };

  const handleDateFilter = () => {
    const newData = reverse ? dataFilter.slice().reverse() : dataFilter.slice();
    setData(newData);
    setReverse(!reverse);
    setRefresh(true)
  };


  return (
    <View style={styles.container}>

      <SearchBar handleFiltering={handleFiltering} handleDateFilter={handleDateFilter}/>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => <PatientDetailsCard item={item} showView={true} onPress={() => navigation.navigate('Patient Details', { item: item })} onPressEdit={() =>{resetStateObj(); navigation.navigate('Add Patient', { existedPatientId: item.id, existedPatientHealthId: item.patienthealthdata?.[item.patienthealthdata?.length - 1].id })}} />}
        keyExtractor={(item,index) => index.toString()}
        // ListHeaderComponent={() => <SearchBar  handleFiltering={handleFiltering} />}
        ListFooterComponent={() =>
          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            <View style={{ width: metrics.screenWidth * 0.4 }}>
              <Button.BtnContain
                label="Add Patient"
                color={colors.green}
                onPress={async() =>{
                  await resetStateObj()
                  navigation.navigate("Add Patient", {
                    params: {
                      screenType: "Entry Point",
                    },
                  })
                }
                }
              />
            </View>
          </View>}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 10,
  },
});
