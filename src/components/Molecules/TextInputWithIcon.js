import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../../constants/colors';
import metrics from '../../constants/layout';
import {Title} from '../Atoms/Typography';
import fonts from '../../constants/fontsSize';

// interface Props {
//   placeholder?: string;
//   label?: string;
//   value?: string;
//   iconName?: string;
//   keyboardtype?: string;
//   onChangeText?: (text: string) => void;
//   onSubmitEditing?: () => void;
//   onEndEditing?: () => void;
//   height?: number;
//   width?: number;
//   password?: boolean;
// }

export default function TextinputwithIcon({
  placeholder,
  label,
  value,
  iconName,
  height,
  width,
  keyboardtype,
  onChangeText,
  onSubmitEditing,
  onEndEditing,
  password,
}) {
  const [showtext, setshowtext] = useState(password);

  const handleChange = (text) => {
    onChangeText && onChangeText(text);
  };

  const handleSubmit = () => {
    onSubmitEditing && onSubmitEditing();
  };

  return (
    <View style={{marginVertical: 10}}>
      {label ? (
        <Title color={colors.black} size={fonts.font12}>
          {label}
        </Title>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: metrics.screenWidth * 0.9,
          borderColor: colors.green,
          borderRadius: 5,
          borderWidth: 0.5,
          marginTop: 5,
        }}>
        <View style={styles.SearchbarContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 10,
            }}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              secureTextEntry={showtext}
              value={value}
              onChangeText={handleChange}
              onSubmitEditing={handleSubmit}
                onEndEditing={onEndEditing}
              placeholderTextColor={colors.darkgray}
              keyboardType={keyboardtype}
              maxLength={keyboardtype === 'number-pad' ? 10 : undefined}
            />
          </View>
        </View>
        {password ? (
          <View>
            <MaterialCommunityIcons
              name={!showtext ? 'eye-off' : 'eye-outline'}
              size={25}
              color={colors.green}
              onPress={() => setshowtext(!showtext)}
            />
          </View>
        ) : (
          <View>
            <MaterialCommunityIcons
              name={iconName}
              size={25}
              color={colors.green}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  SearchbarContainer: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 0.95,
    paddingHorizontal: 5,
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    fontSize: fonts.font12,
    color: colors.black,
    width: metrics.screenWidth * 0.7
  },
});
