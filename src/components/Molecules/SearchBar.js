import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../constants/colors';
import metrics from '../../constants/layout';


// interface Props {
//     placeholder ?: string,
// }

export default function SearchBar(
    {placeholder = 'Search for patients, sort by Date'}
) {
  return (
    <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: metrics.screenWidth * 0.9,
      marginVertical: 15,
    }}>
    <View style={styles.SearchbarContainer}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={colors.green}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          // placeholderTextColor={'#8A8A8A'}
          // cursorColor="#8A8A8A"
          // onChangeText={handleText}
          // value={query}
        />
      </View>
    </View>
    <View>
      <MaterialCommunityIcons name="tune" size={30} color={colors.green} />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    SearchbarContainer: {
        height: 50,
        backgroundColor: colors.faintgray,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 10,
        marginRight: 5,
      },
      input: {
        width: metrics.screenWidth * 0.65,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#8A8A8A',
      },
})