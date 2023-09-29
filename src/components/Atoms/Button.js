import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';
import fonts from '../../constants/fontsSize';
import * as Typography from './Typography';


import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import metrics from '../../constants/layout';


//   interface Props {
//     title?: string;
//     onPress?: () => void;
//     color?: string;
//     width? : number;
//     iconsize?: string;
//     label?: string;
//     icon?: string;
//     disabled?: boolean;
//     labelsize?: number
//     labelcolor?: string
//   }

export const BtnContain = ({
  color,
  disabled,
  label,
  width,
  onPress,
  icon,
  iconsize,
  labelsize, labelColor, iconLeft
}) => {

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.Filled, { backgroundColor: disabled ? '#7BB274' : color }]}>
          {iconsize === 'small' ? (
            <View style={styles.Wrapper}>
              <Typography.SubTitle color={"white"} >{label}</Typography.SubTitle>
              {icon && (
                <MaterialCommunityIcons
                  name={icon}
                  size={20}
                  color={colors.white}
                  style={{ marginLeft: 10 }}
                />
              )}
            </View>
          ) : (
            <View style={styles.Wrapper}>

              {iconLeft && (
                <MaterialCommunityIcons
                  name={iconLeft}
                  size={18}
                  color={labelColor ? colors.green : colors.white}
                  style={{ marginRight: 5 }}
                />
              )}

              <Typography.Title color={labelColor ? colors.green : colors.white} size={labelsize}>{label}</Typography.Title>
              {icon && (
                <MaterialCommunityIcons
                  name={icon}
                  size={18}
                  color={labelColor ? colors.green : colors.white}
                  style={{ marginLeft: 5 }}
                />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const BtnOutline = ({
  color,
  disabled,
  label,
  labelcolor,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.Outlined, { borderWidth: 2, borderColor: color }]}>
          <View style={[styles.LabelWrapper, { padding: 0 }]}>
            <Typography.Title color={labelcolor}>{label}</Typography.Title>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const BtnText = ({ color, label, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.LabelWrapper}>
          <Typography.Title color={color} size={fonts.font12}>
            {label}
          </Typography.Title>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const BtnTxtUnderline = ({ color, label, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.LabelWrapper}>
          <Text
            style={{
              color: color,
              fontSize: 15,
              textDecorationLine: 'underline',
            }}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const FloatingButton = ({ iconName, label, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.FbWrapper}>
          <FontAwesome name={iconName} color="white" />
          <Text style={{ color: 'white', marginLeft: 6, fontSize: 13 }}>
            {label}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const BtnCircle = ({ iconName, size, onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.Circle}>
          <EvilIcons name={iconName} size={size} color="black" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
  },
  Filled: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
    backgroundColor: colors.darkgray,
    elevation:0.5
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Outlined: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 12,
  },
  LabelWrapper: {
    padding: 5,
  },
  FbWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    padding: 14,
    borderRadius: 26,
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3, // Required for Android
  },
  Circle: {
    backgroundColor: colors.white,
    borderRadius: 50,
    padding: 4,
    width: metrics.screenWidth * 0.095,
  },
});