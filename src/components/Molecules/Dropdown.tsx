import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import AntDesign from '@expo/vector-icons/AntDesign';
import metrics from '../../constants/layout';
import colors from '../../constants/colors';

import {BtnText} from '../Atoms/Button';
import fonts from '../../constants/fontsSize';

interface data_objects {
  label: string;
  value: string;
}

interface Props {
  isFocus?: boolean;
  label?: string;
  placeholder?: string;
  dropdowndata: data_objects[];
  width?: number;
  onDropdownChange?: (value: string | number) => void;
  value:string
}

export const DropdownComponent: React.FC<Props> = ({
  placeholder,
  dropdowndata,
  width,
  label,
  onDropdownChange, // callback function
  value
}) => {
  const handleItemSelected = (item: data_objects) => {
    onDropdownChange && onDropdownChange(item.value);
  };


  return (
    <View>
      {label ? <BtnText label={placeholder} color={colors.green} /> : null}
      <Dropdown
        style={[
          styles.dropdown,
          {
            width: width ? width : metrics.screenWidth * 0.9,
            borderColor: label ? colors.red : colors.green,
            borderWidth: label ? 0.5 : 0.5,
            marginTop: label ? -5 : 5,
          },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={dropdowndata}
        maxHeight={300}
        labelField="value"
        valueField="value"
        value={value}
        placeholder={label ? 'Select' : placeholder}
        onChange={handleItemSelected}
        renderRightIcon={() => (
          <AntDesign name="down" size={16} color={colors.black} style={styles.icon} />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: colors.green,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  icon: {
    marginRight: 5,
  },

  placeholderStyle: {
    fontSize: fonts.font12,
    color: colors.green,
    paddingLeft: 10,
    fontFamily: 'Montserrat-Regular',
  },
  selectedTextStyle: {
    fontSize: fonts.font12,
    paddingLeft: 10,
    fontFamily: 'Montserrat-Medium',
    color: colors.green
  },

});