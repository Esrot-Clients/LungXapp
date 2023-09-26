import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import metrics from '../../constants/layout'
import colors from '../../constants/colors'
import { Title } from '../Atoms/Typography'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import fonts from '../../constants/fontsSize'

export default function ReceivedReportCollapsibleCard() {
    const [isactive, setisactive] = useState(false)
  return (
    <View>
    <View style={styles.container}>
      <Title color={colors.green}>
        Vitals
      </Title>
      <MaterialCommunityIcons name={'plus'} size={25} color={colors.green}/>
    </View>
    <View>
    <View style={styles.symptomsDetails}>
      <View style={{flex: 0.33}}><Title color={colors.black} size={fonts.font12}>Asthma</Title></View>
      <View style={{flex: 0.33, alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>Since</Title></View>
      <View style={{flex: 0.33,alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>:{'\t'}1 - 7 days</Title></View>
    </View>
    <View style={styles.symptomsDetails}>
      <View style={{flex: 0.33}}><Title color={colors.black} size={fonts.font12}>Asthma</Title></View>
      <View style={{flex: 0.33, alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>Since</Title></View>
      <View style={{flex: 0.33,alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>:{'\t'}1 - 7 days</Title></View>
    </View>
    <View style={styles.symptomsDetails}>
      <View style={{flex: 0.33}}><Title color={colors.black} size={fonts.font12}>Asthma</Title></View>
      <View style={{flex: 0.33, alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>Since</Title></View>
      <View style={{flex: 0.33,alignItems: 'flex-end'}}><Title color={colors.black} size={fonts.font12}>:{'\t'}1 - 7 days</Title></View>
    </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: metrics.screenWidth * 0.9,
        padding: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: colors.green,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    symptomsDetails: {
        display: 'flex',
        flexDirection: 'row',
        width: metrics.screenWidth * 0.9,
        marginVertical: 8,
        alignItems: 'center',
        borderColor: colors.green,
        padding: 10,
      },
})