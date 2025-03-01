import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { HMSMessage } from '@100mslive/react-native-hms';

import { useHMSRoomStyleSheet } from '../hooks-util';

interface HMSHLSMessageProps {
  message: HMSMessage;
}

const _HMSHLSMessage: React.FC<HMSHLSMessageProps> = ({ message }) => {
  const messageSender = message.sender;

  const hmsRoomStyles = useHMSRoomStyleSheet(
    (_theme, typography) => ({
      senderName: {
        color: '#ffffff',
        fontFamily: `${typography.font_family}-SemiBold`,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
      message: {
        color: '#ffffff',
        fontFamily: `${typography.font_family}-Regular`,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    }),
    []
  );

  return (
    <View style={styles.container}>
      <Text
        style={[styles.senderName, hmsRoomStyles.senderName]}
        numberOfLines={1}
      >
        {messageSender
          ? messageSender.isLocal
            ? 'You'
            : messageSender.name
          : 'Anonymous'}
      </Text>

      <Text style={[styles.message, hmsRoomStyles.message]}>
        {message.message}
      </Text>
    </View>
  );
};

export const HMSHLSMessage = React.memo(_HMSHLSMessage);

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: '100%',
  },
  senderName: {
    fontSize: 14,
    lineHeight: Platform.OS === 'android' ? 20 : undefined,
    letterSpacing: 0.1,
    textShadowOffset: { height: 1, width: 1 },
    textShadowRadius: 2,
  },
  message: {
    fontSize: 14,
    lineHeight: Platform.OS === 'android' ? 20 : undefined,
    letterSpacing: 0.25,
    marginTop: 2,
    textShadowOffset: { height: 0.5, width: 0.5 },
    textShadowRadius: 2,
  },
});
