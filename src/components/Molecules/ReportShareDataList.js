import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';

import * as Typography from '../Atoms/Typography';

import colors from '../../constants/colors';
import metrics from '../../constants/layout';
import fonts from '../../constants/fontsSize';
import LungXinstance from '../../api/server';

const ReportShareDataList = ({
    item,
    onPress,
}) => {

    // const [patientCode, setPatientCode] = useState("")

    // const handlePatientData = async () => {
    //     try {
    //         const payload = {
    //             id: item?.patient_health?.[0]?.id,
    //             doctor_id: item?.doctor
    //         }
    //         const res = await LungXinstance.post("/api/patients/", payload, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data"
    //             }
    //         })
    //         setPatientCode(res?.data?.[0].patient_code)
    //     } catch (e) {
    //         console.log("Error in ReportShareDataList ", e)
    //     }
    // }

    // useEffect(() => {
    //     handlePatientData()
    // }, [])

    return (
        <View style={styles.PatientDetailsContainer}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Typography.Title size={fonts.font12}>Patient ID  : {item?.patient?.patient_code}</Typography.Title>
                        <Typography.SubTitle>Date : {new Date(item?.created_at).toLocaleDateString().replaceAll('/', "-")} </Typography.SubTitle>
                    </View>
                    <View
                        style={{
                            alignItems: 'flex-end',
                            flex: 1,
                            justifyContent: 'center',
                        }}>
                        <TouchableOpacity onPress={onPress}>
                            <Typography.Title color={colors.green} size={fonts.font12}>View</Typography.Title>
                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    PatientDetailsContainer: {
        width: metrics.screenWidth * 0.9,
        paddingVertical: 10,
        marginVertical: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: colors.green,
        borderRadius: 8,
    },
});

export default ReportShareDataList;
