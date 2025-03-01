import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useHMSRoomStyleSheet, useLeaveMethods } from '../hooks-util';
import { AlertTriangleIcon, CloseIcon } from '../Icons';
import { HMSDangerButton } from './HMSDangerButton';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux';

export interface EndRoomModalContentProps {
  dismissModal(): void;
}

export const EndRoomModalContent: React.FC<EndRoomModalContentProps> = ({
  dismissModal,
}) => {
  const { endRoom, leave } = useLeaveMethods(false);

  const hmsRoomStyles = useHMSRoomStyleSheet((theme, typography) => ({
    headerText: {
      color: theme.palette.alert_error_default,
      fontFamily: `${typography.font_family}-SemiBold`,
    },
    text: {
      color: theme.palette.on_surface_medium,
      fontFamily: `${typography.font_family}-Regular`,
    },
  }));

  const canEndRoom = useSelector(
    (state: RootState) => state.hmsStates.localPeer?.role?.permissions?.endRoom
  );

  const canStream = useSelector(
    (state: RootState) =>
      state.hmsStates.localPeer?.role?.permissions?.hlsStreaming
  );

  const isStreaming = useSelector(
    (state: RootState) =>
      state.hmsStates.room?.hlsStreamingState?.running ?? false
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerControls}>
          <AlertTriangleIcon />

          <Text style={[styles.headerText, hmsRoomStyles.headerText]}>
            {canStream && isStreaming
              ? 'End Stream'
              : canEndRoom
              ? 'End Session'
              : 'Leave'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={dismissModal}
          hitSlop={styles.closeIconHitSlop}
        >
          <CloseIcon />
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, hmsRoomStyles.text]}>
        {canStream && isStreaming
          ? 'The stream will end for everyone after they’ve watched it.'
          : canEndRoom
          ? 'The session will end for everyone in the room immediately. '
          : 'Others will continue after you leave. You can join the session again.'}
      </Text>
      <HMSDangerButton
        loading={false}
        onPress={canStream && isStreaming ? () => leave(true) : endRoom}
        title={canStream && isStreaming ? 'End Stream' : 'End Session'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.15,
    marginLeft: 8,
  },
  closeIconHitSlop: {
    bottom: 16,
    left: 16,
    right: 16,
    top: 16,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    marginBottom: 24,
  },
});
