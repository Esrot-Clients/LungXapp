import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import metrics from '../../constants/layout';
import fonts from '../../constants/fontsSize';
import colors from '../../constants/colors';
import * as Typography from '../Atoms/Typography';
import {BtnContain, BtnOutline, BtnText} from '../Atoms/Button';


// interface Props {
//   placeholder?: string;
//   label?: string;
//   value: string;
//   handleonChangeText?: (text: string) => void;
//   onUpdate?: (text: string) => void;
//   onCancel?: (text: string) => void;
//   height?: number;
//   width?: number;
// }

export const TextinputwithEditButton = ({
  label,
  value,
  height,
  handleonChangeText,
  onUpdate,
  onCancel,
}) => {

  const [text, setText] = useState(value)
  const [cancelledStateText, setcancelledStateText] = useState(value)
  const [editable, seteditable] = useState(false);


  const handleEdit = () => {
    seteditable(true);
  };

  const handleUpdate = () => {
    seteditable(false);
    onUpdate && onUpdate(text)
    // Perform any necessary update logic here
  };

  const handleCancel = () => {
    seteditable(false);
    setText(cancelledStateText);
    onCancel && onCancel(cancelledStateText)
  };




  const handleChangeText = (textvalue) => {
    // console.log("value", textvalue)
    setText(textvalue);
    // console.log("text",text)
    handleonChangeText && handleonChangeText(textvalue);
  };


  return (
    <View style={{marginVertical: 10}}>
      {label ? <BtnText label={label} color={colors.green} /> : null}
      <View style={[styles.textinput, {marginTop: label ? -5 : 0}]}>
        <TextInput
          editable={editable}
          style={[
            {
              height: 50,
              width: metrics.screenWidth * 0.7,
            },
          ]}
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleUpdate}
          placeholderTextColor="gray"
          autoCapitalize="none"
          multiline={height ? true : false}
        />
        {!editable ? (
                  <View style={{flex: 1, alignItems: 'flex-end', marginRight: 5}}>
                  <TouchableOpacity onPress={handleEdit}>
                    <Typography.SubTitle>Edit</Typography.SubTitle>
                  </TouchableOpacity>
                </View>
        ) : null}
      </View>
      {editable ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View style={{width: metrics.screenWidth * 0.9 / 2}}>
            <BtnContain
              label="Update"
              color={colors.green}
              disabled={text == value}
              onPress={handleUpdate}
            />
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <BtnOutline
              label="Cancel"
              color={colors.green}
              onPress={handleCancel}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  textinput: {
    flexDirection: 'row',
    width: metrics.screenWidth * 0.9,
    borderColor: colors.green,
    borderRadius: 5,
    borderWidth: 0.5,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: fonts.font12,
    fontFamily: 'Montserrat-Regular',
    color: colors.red,
  },
});

export default TextinputwithEditButton;