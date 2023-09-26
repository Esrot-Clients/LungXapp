import {StyleSheet, Text, View, FlatList} from 'react-native';
import React,{ useEffect, useState } from 'react';
import PatientDetailsCard from '../components/Molecules/PatientDetailsCard';

import * as Button from '../components/Atoms/Button';

import colors from '../constants/colors';
import metrics from '../constants/layout';
import SearchBar from '../components/Molecules/SearchBar';
import { useQuery } from 'react-query';
import patientListApi from '../api/patientList';
import { useIsFocused ,useFocusEffect} from '@react-navigation/native';
import LungXinstance from '../api/server';

export default function InPatientDetails({navigation}) {

  // const {data}=useQuery("getPatientList",patientListApi.getPatientList)

  const focused=useIsFocused()

  const [data,setData]=useState([])
  
  const getData=async()=>{
    try{
    const res=await LungXinstance.get("/api/patients/")
    var d= res.data?.filter(ele=>ele?.in_patient==true)
    setData(d)
    // console.log("ghui",d)
    }catch(e){
      console.log("Error...getData in patient",e)
    }
  }
  
  useEffect(()=>{
    getData()
  },[focused])
  

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({item}) => <PatientDetailsCard item={item} showView={true} onPress={()=> navigation.navigate('In Patient Session Details',{item})}  onPressEdit={()=>navigation.navigate('Add Patient',{existedPatientId:item.id,existedPatientHealthId:item.patienthealthdata?.[item.patienthealthdata?.length -1].id })}/>}
        keyExtractor={item => item.toString()}
        ListHeaderComponent={()=> <SearchBar/>}
        ListFooterComponent={() => (
          <View style={{marginVertical: 20, alignItems: 'center'}}>
            <View style={{width: metrics.screenWidth * 0.4}}>
              <Button.BtnContain
                label="Add Patient"
                color={colors.green}
                onPress={()=> navigation.navigate('Add Patient', {
                  screenType: 'Entry Point',
                })}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 20,
  },
});
