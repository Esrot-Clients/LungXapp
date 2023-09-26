import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import PatientDetailsCard from '../components/Molecules/PatientDetailsCard'
import { useMutation } from "react-query"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import SearchBar from '../components/Molecules/SearchBar'
import colors from '../constants/colors'
import LungXinstance from '../api/server'
import { AuthContext } from '../context/AuthContext'
import { useIsFocused } from '@react-navigation/native';
import ReportShareDataList from '../components/Molecules/ReportShareDataList'

// import getPatientListOfADoctor from '../api/annotations'

export default function AnnotationScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused()


  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Reports',
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
            marginRight: 30,
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

  const [repotsList, setReportsList,] = useState([])

  const handleData = async () => {
    try {
      const res = await LungXinstance.get("/api/view-shared-data/")
      setReportsList(res.data)
    } catch (e) {
      console.log("Error...getData in report annotation", e)
    }
  }

  useEffect(() => {
    handleData()
  }, [isFocused])

  const handleMarkDataViewed=async(id)=>{
    try{
    const res = await LungXinstance.patch(`/api/mark-data-as-viewed/${id}/`)
    if(res.data?.viewed === true){
    navigation.navigate('Received Report Details',{ShareDataId: id})
    }
  } catch (e) {
    console.log("Error...getData in report annotation", e)
  }
  }

  return (
    <View style={styles.container}>
      <SearchBar />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={repotsList}
        renderItem={({ item }) => <ReportShareDataList item={item} onPress={() => handleMarkDataViewed(item.id)} />}
        keyExtractor={(item) => item.toString()}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 5,
  }
})