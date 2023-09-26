import {Text, View, Platform} from 'react-native';
import React, {PropsWithChildren} from 'react';
import fonts from '../../constants/fontsSize';

export const Title = ({children, color, size}) => {
  return (
    <View>
      <Text
        style={{
          fontSize: size ? size : fonts.font14,
          fontFamily: Platform.OS === 'android' ? 'Montserrat-Medium' : 'Avenir',
          color: color ? color : '#211C5A',
          fontWeight: '400'
          
        }}>
        {children}
      </Text>
    </View>
  );
};

export const SubTitle = ({children, color, size}) => {
  return (
    <View>
      <Text
        style={{
          fontSize: size ? size : fonts.font10,
          fontFamily: Platform.OS === 'android' ? 'Montserrat-Medium' : 'Avenir',
          color: color? color : '#211C5A',
          marginVertical: 5,
        }}>
        {children}
      </Text>
    </View>
  );
};

export const Paragraph = ({children}) => {
  return (
    <View>
      <Text
        style={{
          fontSize: fonts.font8,
          fontFamily: Platform.OS === 'android' ? 'Poppins-Regular' : 'Avenir',
          color: '#000',
        }}>
        {children}
      </Text>
    </View>
  );
};


const StyleSheet = {
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
      },
      sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
      },
      highlight: {
        fontWeight: '700',
      },
}