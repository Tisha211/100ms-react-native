import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  InteractionManager,
} from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HMSTrack } from '@100mslive/react-native-hms';

import type { RootState } from '../redux';
import { ModalTypes } from '../utils/types';
import type { PeerTrackNode } from '../utils/types';
import { setInsetViewMinimized } from '../redux/actions';
import { useHMSRoomStyle, useModalType } from '../hooks-util';
import {
  CameraIcon,
  MicIcon,
  MinimizeIcon,
  PencilIcon,
  PersonIcon,
} from '../Icons';
import { BottomSheet } from './BottomSheet';

interface PeerSettingsModalContentProps {
  peerTrackNode: PeerTrackNode;
  peerTrackNodesListEmpty: boolean;
  cancelModal(): void;
  onCaptureScreenShotPress(node: PeerTrackNode): void;
  onCaptureImageAtMaxSupportedResolutionPress(node: PeerTrackNode): void;
  onStreamingQualityPress(track: HMSTrack): void;
}

export const PeerSettingsModalContent: React.FC<
  PeerSettingsModalContentProps
> = ({ peerTrackNode, peerTrackNodesListEmpty, cancelModal }) => {
  const dispatch = useDispatch();
  const hmsInstance = useSelector((state: RootState) => state.user.hmsInstance);
  const localPeer = useSelector(
    (state: RootState) => state.hmsStates.localPeer
  );
  const settingsForMiniview = useSelector((state: RootState) => {
    const mininode = state.app.miniviewPeerTrackNode;
    return mininode && mininode.id === peerTrackNode.id;
  });

  const removeTextStyle = useHMSRoomStyle((theme) => ({
    color: theme.palette.alert_error_default,
  }));

  const { handleModalVisibleType: setModalVisible } = useModalType();

  const removePeer = () => {
    hmsInstance
      ?.removePeer(peerTrackNode.peer, 'removed from room')
      .then((d) => console.log('Remove Peer Success: ', d))
      .catch((e) => console.log('Remove Peer Error: ', e));

    cancelModal();
  };

  const toggleMuteAudio = () => {
    cancelModal();

    if (peerTrackNode.peer.isLocal) {
      return;
    }

    hmsInstance?.changeTrackState(
      peerTrackNode.peer.audioTrack!!,
      !peerTrackNode.peer.audioTrack!!.isMute()
    );
  };

  const toggleMuteVideo = () => {
    cancelModal();

    if (peerTrackNode.peer.isLocal) {
      return;
    }

    hmsInstance?.changeTrackState(
      peerTrackNode.peer.videoTrack!!,
      !peerTrackNode.peer.videoTrack!!.isMute()
    );
  };

  const changeName = () => {
    setModalVisible(ModalTypes.CHANGE_NAME, true);
  };

  const handleMinimizeVideoPress = () => {
    cancelModal();
    InteractionManager.runAfterInteractions(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      dispatch(setInsetViewMinimized(true));
    });
  };

  const { peer } = peerTrackNode;

  const localPeerPermissions = localPeer?.role?.permissions;

  const isPeerAudioMute = peer.isLocal ? null : peer.audioTrack?.isMute();
  const isPeerVideoMute = peer.isLocal ? null : peer.videoTrack?.isMute();

  return (
    <View>
      <BottomSheet.Header
        dismissModal={cancelModal}
        heading={peer.name + (peer.isLocal ? ' (You)' : '')}
        subheading={peer.role?.name}
      />

      <BottomSheet.Divider />

      {/* Content */}
      <View style={styles.contentContainer}>
        {peer.isLocal ? (
          <SettingItem
            text={'Change Name'}
            icon={<PencilIcon style={styles.customIcon} />}
            onPress={changeName}
          />
        ) : null}

        {settingsForMiniview ? (
          <SettingItem
            text={'Minimize Your Video'}
            icon={<MinimizeIcon style={styles.customIcon} />}
            onPress={handleMinimizeVideoPress}
            disabled={peerTrackNodesListEmpty}
          />
        ) : null}

        {!peer.isLocal &&
        (localPeerPermissions?.mute || localPeerPermissions?.unmute) ? (
          <>
            {/* If Peer's Audio is Muted and Local Peer has unmute Permissions */}
            {isPeerAudioMute && localPeerPermissions?.unmute ? (
              <SettingItem
                text={'Request Audio Unmute'}
                icon={<MicIcon muted={false} style={styles.customIcon} />}
                onPress={toggleMuteAudio}
              />
            ) : null}

            {/* If Peer's Audio is Unmuted and Local Peer has mute Permissions */}
            {!isPeerAudioMute && localPeerPermissions?.mute ? (
              <SettingItem
                text={'Mute Audio'}
                icon={<MicIcon muted={true} style={styles.customIcon} />}
                onPress={toggleMuteAudio}
              />
            ) : null}
          </>
        ) : null}

        {!peer.isLocal &&
        (localPeerPermissions?.mute || localPeerPermissions?.unmute) ? (
          <>
            {/* If Peer's Video is Muted and Local Peer has unmute Permissions */}
            {isPeerVideoMute && localPeerPermissions?.unmute ? (
              <SettingItem
                text={'Request Video Unmute'}
                icon={<CameraIcon muted={false} style={styles.customIcon} />}
                onPress={toggleMuteVideo}
              />
            ) : null}

            {/* If Peer's Video is Unmuted and Local Peer has mute Permissions */}
            {!isPeerVideoMute && localPeerPermissions?.mute ? (
              <SettingItem
                text={'Mute Video'}
                icon={<CameraIcon muted={true} style={styles.customIcon} />}
                onPress={toggleMuteVideo}
              />
            ) : null}
          </>
        ) : null}

        {!peer.isLocal && localPeerPermissions?.removeOthers ? (
          <SettingItem
            text="Remove Participant"
            textStyle={removeTextStyle}
            icon={<PersonIcon type="left" style={styles.customIcon} />}
            onPress={removePeer}
          />
        ) : null}
      </View>
    </View>
  );
};

type SettingItemProps = {
  onPress(): void;
  text: string;
  icon: React.ReactElement;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
};

const SettingItem: React.FC<SettingItemProps> = ({
  onPress,
  text,
  icon,
  textStyle,
  disabled = false,
}) => {
  const textStyles = useHMSRoomStyle((theme, typography) => ({
    color: theme.palette.on_surface_high,
    fontFamily: `${typography.font_family}-SemiBold`,
  }));

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.button, disabled ? { opacity: 0.6 } : null]}
      onPress={onPress}
    >
      {icon}

      <Text style={[styles.text, textStyles, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 8,
  },
  customIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});
