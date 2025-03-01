import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { PeerTrackNode } from '../utils/types';
import { useRTCStatsListeners } from '../utils/hooks';
import {
  clearPendingModalTasks,
  useFetchHMSRoles,
  useHMSMessages,
  useHMSNetworkQualityUpdate,
  useHMSPIPRoomLeave,
  useHMSReconnection,
  useHMSRemovedFromRoomUpdate,
  useHMSRoomStyle,
  useIsHLSViewer,
  usePIPListener,
} from '../hooks-util';
import { MeetingScreenContent } from './MeetingScreenContent';
import { HMSHLSStreamLoading } from './HMSHLSStreamLoading';
import type { RootState } from '../redux';

interface MeetingProps {
  peerTrackNodes: Array<PeerTrackNode>;
}

export const Meeting: React.FC<MeetingProps> = ({ peerTrackNodes }) => {
  const startingHLSStream = useSelector(
    (state: RootState) => state.app.startingHLSStream
  );

  const isHLSViewer = useIsHLSViewer();

  // TODO: Fetch latest Room and localPeer on mount of this component?

  useFetchHMSRoles();

  useHMSMessages();

  useHMSReconnection();

  useHMSRemovedFromRoomUpdate();

  // Handle when user press leave button visible on PIP Window
  useHMSPIPRoomLeave();

  // Handle state change to reset layout when App is focused from PIP Window
  usePIPListener();

  // Handle rendering RTC stats on Tiles and inside RTC stats modal
  useRTCStatsListeners();

  // Subscribe to Peers Network quality updates
  useHMSNetworkQualityUpdate();

  // Clearing any pending modal opening tasks
  React.useEffect(() => {
    return () => {
      clearPendingModalTasks();
    };
  }, []);

  const containerStyles = useHMSRoomStyle((theme) => ({
    backgroundColor: theme.palette.background_dim,
  }));

  if (startingHLSStream) {
    return <HMSHLSStreamLoading />;
  }

  const Container = isHLSViewer ? View : SafeAreaView;

  /**
   * TODO: disbaled Expended View animation in Webrtc flow
   *
   * Problem: Tiles Flatlist was not scrollable because Root Pressable was registering screen taps.
   * Solution: Try using Tab Gesture detector instead on Pressable component
   */
  return (
    <Container
      style={[styles.container, containerStyles]}
      edges={['left', 'right']}
    >
      <MeetingScreenContent peerTrackNodes={peerTrackNodes} />

      {/* {landscapeChatViewVisible ? <ChatView /> : null} */}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
});
