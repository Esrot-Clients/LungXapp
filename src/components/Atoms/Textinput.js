import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';
import metrics from '../../constants/layout';
import fonts from '../../constants/fontsSize';
import colors from '../../constants/colors';
import { Title } from './Typography';


// interface Props {
//   placeholder?: string;
//   label?: string;
//   value?: string;
//   multiline? : boolean;
//   editable?: boolean;
//   onChangeText?: (text: string) => void;
//   onSubmitEditing?: () => void;
//   height?: number;
//   width?: number;
// }

export const Textinput = ({
  placeholder,
  label,
  value,
  height,
  width,
  multiline,
  editable,
  onChangeText,
  onSubmitEditing, keyboardType, autoCapitalize
}) => {


  const handleChange = (text) => {
    onChangeText && onChangeText(text);
  };

  const handleSubmit = () => {
    onSubmitEditing && onSubmitEditing();
  };

  return (
    <View style={{ marginVertical: 10, }}>
      {label ? <Title color={colors.black} size={fonts.font12}>{label}</Title> : null}
      <TextInput
        editable={editable}
        style={[
          styles.textinput,
          {
            height: height ? height : 55,
            width: width ? width : metrics.screenWidth * 0.9,
            textAlignVertical: height ? 'top' : 'center',
            // textAlign: width ? 'center' : 'left'
          },
        ]}
        value={value}
        onChangeText={handleChange}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor="gray"
        autoCapitalize={autoCapitalize? autoCapitalize: "none"}
        multiline={height ? true : false}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    borderColor: colors.green,
    borderRadius: 8,
    borderWidth: 0.5,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    fontSize: fonts.font12,
    color: colors.black,
    fontFamily: 'Montserrat-Regular',

  },
});

export default Textinput;