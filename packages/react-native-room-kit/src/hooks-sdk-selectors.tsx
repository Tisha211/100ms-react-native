import type { HMSRole } from '@100mslive/react-native-hms';

import type { RootState } from './redux';

export const selectAllowedTracksToPublish = (state: RootState) =>
  state.hmsStates.localPeer?.role?.publishSettings?.allowed;

export const selectCanPublishTrack = (
  state: RootState,
  track: 'audio' | 'video' | 'screen'
) => selectAllowedTracksToPublish(state)?.includes(track) ?? false;

export const selectCanPublishTrackForRole = (
  role: HMSRole | undefined,
  track: 'audio' | 'video' | 'screen'
) => role?.publishSettings?.allowed?.includes(track) ?? false;
