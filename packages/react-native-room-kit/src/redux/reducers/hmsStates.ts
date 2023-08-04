import type {
  HMSLocalPeer,
  HMSPeer,
  HMSRole,
  HMSRoom,
} from '@100mslive/react-native-hms';
import type { Layout } from '@100mslive/types-prebuilt';
import { HmsStateActionTypes } from '../actionTypes';

type ActionType =
  | SetRoomAction
  | SetLocalPeerAction
  | SetRolesAction
  | SetIsLocalAudioMutedAction
  | SetIsLocalVideoMutedAction
  | SetIsLocalScreenSharedAction
  | SetRoomLocallyMutedAction
  | ResetAction
  | AddToPreviewPeersList
  | RemoveFromPreviewPeersList
  | SetLayoutConfig;

type SetRoomAction = {
  type: HmsStateActionTypes.SET_ROOM_STATE;
  room: HMSRoom | null;
};

type SetLocalPeerAction = {
  type: HmsStateActionTypes.SET_LOCAL_PEER_STATE;
  localPeer: HMSLocalPeer | null;
};

type SetRolesAction = {
  type: HmsStateActionTypes.SET_ROLES_STATE;
  roles: HMSRole[];
};

type SetIsLocalAudioMutedAction = {
  type: HmsStateActionTypes.SET_IS_LOCAL_AUDIO_MUTED_STATE;
  isLocalAudioMuted: boolean | undefined;
};

type SetIsLocalVideoMutedAction = {
  type: HmsStateActionTypes.SET_IS_LOCAL_VIDEO_MUTED_STATE;
  isLocalVideoMuted: boolean | undefined;
};

type SetIsLocalScreenSharedAction = {
  type: HmsStateActionTypes.SET_IS_LOCAL_SCREEN_SHARED_STATE;
  isLocalScreenShared: boolean | undefined;
};

type ResetAction = {
  type: HmsStateActionTypes.CLEAR_STATES;
};

type SetRoomLocallyMutedAction = {
  type: HmsStateActionTypes.SET_ROOM_LOCALLY_MUTED;
  roomLocallyMuted: boolean;
};

type AddToPreviewPeersList = {
  type: HmsStateActionTypes.ADD_TO_PREVIEW_PEERS_LIST;
  peer: HMSPeer;
};

type RemoveFromPreviewPeersList = {
  type: HmsStateActionTypes.REMOVE_FROM_PREVIEW_PEERS_LIST;
  peerId: string;
};

type SetLayoutConfig = {
  type: HmsStateActionTypes.SET_LAYOUT_CONFIG;
  layoutConfig: Layout;
};

type IntialStateType = {
  isLocalAudioMuted: boolean | undefined;
  isLocalVideoMuted: boolean | undefined;
  isLocalScreenShared: boolean | undefined;
  roomLocallyMuted: boolean;
  room: HMSRoom | null;
  localPeer: HMSLocalPeer | null;
  roles: HMSRole[];
  previewPeersList: HMSPeer[];
  layoutConfig: Layout | null;
};

const INITIAL_STATE: IntialStateType = {
  isLocalAudioMuted: undefined,
  isLocalVideoMuted: undefined,
  isLocalScreenShared: undefined,
  roomLocallyMuted: false,
  room: null,
  localPeer: null,
  roles: [],
  previewPeersList: [],
  layoutConfig: null,
};

const hmsStatesReducer = (
  state = INITIAL_STATE,
  action: ActionType
): IntialStateType => {
  switch (action.type) {
    case HmsStateActionTypes.SET_ROOM_STATE:
      return {
        ...state,
        room: action.room,
      };
    case HmsStateActionTypes.SET_LOCAL_PEER_STATE:
      return {
        ...state,
        localPeer: action.localPeer,
        isLocalAudioMuted: action.localPeer?.audioTrack?.isMute(),
        isLocalVideoMuted: action.localPeer?.videoTrack?.isMute(),
      };
    case HmsStateActionTypes.SET_ROLES_STATE:
      return {
        ...state,
        roles: action.roles,
      };
    case HmsStateActionTypes.SET_IS_LOCAL_AUDIO_MUTED_STATE:
      return {
        ...state,
        isLocalAudioMuted: action.isLocalAudioMuted,
      };
    case HmsStateActionTypes.SET_IS_LOCAL_VIDEO_MUTED_STATE:
      return {
        ...state,
        isLocalVideoMuted: action.isLocalVideoMuted,
      };
    case HmsStateActionTypes.SET_IS_LOCAL_SCREEN_SHARED_STATE:
      return {
        ...state,
        isLocalScreenShared: action.isLocalScreenShared,
      };
    case HmsStateActionTypes.SET_ROOM_LOCALLY_MUTED:
      return {
        ...state,
        roomLocallyMuted: action.roomLocallyMuted,
      };
    case HmsStateActionTypes.ADD_TO_PREVIEW_PEERS_LIST:
      return {
        ...state,
        previewPeersList: [...state.previewPeersList, action.peer],
      };
    case HmsStateActionTypes.REMOVE_FROM_PREVIEW_PEERS_LIST:
      return {
        ...state,
        previewPeersList: state.previewPeersList.filter(
          (prevPeer) => prevPeer.peerID !== action.peerId
        ),
      };
    case HmsStateActionTypes.SET_LAYOUT_CONFIG:
      return {
        ...state,
        layoutConfig: action.layoutConfig,
      };
    case HmsStateActionTypes.CLEAR_STATES:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default hmsStatesReducer;
