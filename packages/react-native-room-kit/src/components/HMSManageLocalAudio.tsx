import * as React from 'react';
import { useSelector } from 'react-redux';

import { MicIcon } from '../Icons';
import { useCanPublishAudio, useHMSActions } from '../hooks-sdk';
import type { RootState } from '../redux';
import { PressableIcon } from './PressableIcon';

export const HMSManageLocalAudio = () => {
  const canPublishAudio = useCanPublishAudio();

  if (!canPublishAudio) {
    return null;
  }

  return <ToggleAudioMuteButton />;
};

const ToggleAudioMuteButton = () => {
  const hmsActions = useHMSActions();
  // TODO: set initial `isLocalAudioMuted` state value as per initial track setting
  const isLocalAudioMuted = useSelector(
    (state: RootState) => state.hmsStates.isLocalAudioMuted
  );

  const handleAudioMuteTogglePress = async () => {
    // TODO: add getter API for state
    // const enabled = hmsStore.getState(selectIsLocalAudioEnabled);
    await hmsActions.setLocalAudioEnabled(!isLocalAudioMuted);
  };

  return (
    <PressableIcon
      onPress={handleAudioMuteTogglePress}
      active={isLocalAudioMuted}
    >
      <MicIcon muted={!!isLocalAudioMuted} />
    </PressableIcon>
  );
};
