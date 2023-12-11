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


    return (
        <View style={styles.PatientDetailsContainer}>
            <TouchableOpacity onPress={onPress}>

                <Typography.SubTitle>Date : {new Date(item?.created_at).toLocaleDateString().replaceAll('/', "-")} </Typography.SubTitle>

                <View style={styles.viewOfHead}>
                    <View style={styles.viewOfHeadInner1}>
                        <Typography.Title size={fonts.font12}>Patient ID : {item?.patient?.patient_code}</Typography.Title>
                        <Typography.Title size={fonts.font12}>Patient Name : {item?.patient?.patient_name?(item?.patient?.patient_name).toUpperCase():null}</Typography.Title>
                    </View>

                    <TouchableOpacity onPress={onPress} style={styles.viewOfHeadInner2}>
                        <Typography.Title color={colors.green} size={fonts.font12}>View</Typography.Title>
                    </TouchableOpacity>

                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    PatientDetailsContainer: {
        width: metrics.screenWidth * 0.9,
        paddingVertical: 5,
        marginVertical: 5,
        paddingHorizontal: 13,
        borderWidth: 1,
        borderColor: colors.green,
        borderRadius: 8,
    },
    viewOfHead: { flexDirection: 'row', paddingHorizontal: 7, marginBottom: 7, },
    viewOfHeadInner1: { flexWrap: "wrap", width: "89%", },
    viewOfHeadInner2: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center', width: "11%",
    }
});

export default ReportShareDataList;
