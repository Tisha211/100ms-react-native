import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState } from './redux';

import {
  setIsLocalAudioMutedState,
  setIsLocalScreenSharedState,
  setIsLocalVideoMutedState,
} from './redux/actions';
import {
  selectAllowedTracksToPublish,
  selectCanPublishTrack,
} from './hooks-sdk-selectors';
import { useCallback } from 'react';

export const useAllowedTracksToPublish = () => {
  return useSelector(selectAllowedTracksToPublish);
};

export const useCanPublishAudio = () => {
  return useSelector((state: RootState) =>
    selectCanPublishTrack(state, 'audio')
  );
};

export const useCanPublishVideo = () => {
  return useSelector((state: RootState) =>
    selectCanPublishTrack(state, 'video')
  );
};

export const useCanPublishScreen = () => {
  return useSelector((state: RootState) =>
    selectCanPublishTrack(state, 'screen')
  );
};

export const useHMSActions = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const setLocalAudioEnabled = useCallback(async (enable: boolean) => {
    const state: RootState = store.getState();
    const localPeer = state.hmsStates.localPeer;

    if (!localPeer) {
      return Promise.reject('Local Peer Instance is not available!');
    }
    const localAudioTrack = localPeer.localAudioTrack();
    if (!localAudioTrack) {
      return Promise.reject(
        'Local Peer Audio Track Instance is not available!'
      );
    }
    try {
      dispatch(setIsLocalAudioMutedState(enable));
      localAudioTrack.setMute(enable);
    } catch (error) {
      dispatch(setIsLocalAudioMutedState(!enable));
      return Promise.reject(error);
    }
  }, []);

  const setLocalVideoEnabled = useCallback(async (enable: boolean) => {
    const state: RootState = store.getState();
    const localPeer = state.hmsStates.localPeer;

    if (!localPeer) {
      return Promise.reject('Local Peer Instance is not available!');
    }
    const localVideoTrack = localPeer.localVideoTrack();
    if (!localVideoTrack) {
      return Promise.reject(
        'Local Peer Video Track Instance is not available!'
      );
    }
    try {
      dispatch(setIsLocalVideoMutedState(enable));
      localVideoTrack.setMute(enable);
    } catch (error) {
      dispatch(setIsLocalVideoMutedState(!enable));
      return Promise.reject(error);
    }
  }, []);

  const switchCamera = useCallback(async () => {
    const state: RootState = store.getState();
    const localPeer = state.hmsStates.localPeer;

    if (!localPeer) {
      return Promise.reject('Local Peer Instance is not available!');
    }
    const localVideoTrack = localPeer.localVideoTrack();
    if (!localVideoTrack) {
      return Promise.reject(
        'Local Peer Video Track Instance is not available!'
      );
    }

    localVideoTrack.switchCamera();
  }, []);

  const setScreenShareEnabled = useCallback(async (enable: boolean) => {
    const state: RootState = store.getState();
    const hmsInstance = state.user.hmsInstance;

    if (!hmsInstance) {
      return Promise.reject('HMSSDK Instance is not available!');
    }

    try {
      if (enable) {
        const result = await hmsInstance.startScreenshare();
        console.log('Start Screenshare Success: ', result);
      } else {
        const result = await hmsInstance.stopScreenshare();
        console.log('Stop Screenshare Success: ', result);
      }

      dispatch(setIsLocalScreenSharedState(enable));
    } catch (error) {
      if (enable) {
        console.log('Start Screenshare Error: ', error);
      } else {
        console.log('Stop Screenshare Error: ', error);
      }
      return Promise.reject(error);
    }
  }, []);

  const changeMetadata = useCallback(async (metadata: string | object) => {
    const state: RootState = store.getState();
    const hmsInstance = state.user.hmsInstance;

    if (!hmsInstance) {
      return Promise.reject('HMSSDK Instance is not available!');
    }

    try {
      const parsedMetadata =
        typeof metadata === 'string' ? metadata : JSON.stringify(metadata);
      const result = await hmsInstance.changeMetadata(parsedMetadata);
      console.log('Change Metadata Success: ', result);
    } catch (error) {
      console.log('Change Metadata Error: ', error);
      return Promise.reject(error);
    }
  }, []);

  const changeName = useCallback(async (name: string): Promise<void> => {
    const state: RootState = store.getState();
    const hmsInstance = state.user.hmsInstance;

    if (!hmsInstance) {
      return Promise.reject('HMSSDK Instance is not available!');
    }

    try {
      const result = await hmsInstance.changeName(name);
      console.log('Change Name Success: ', result);
    } catch (error) {
      console.log('Change Name Error: ', error);
      return Promise.reject(error);
    }
  }, []);

  return {
    setLocalAudioEnabled,
    setLocalVideoEnabled,
    switchCamera,
    setScreenShareEnabled,
    changeMetadata,
    changeName,
  };
};
