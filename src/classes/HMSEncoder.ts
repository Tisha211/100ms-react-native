import { HMSTrack } from './HMSTrack';
import { HMSAudioTrack } from './HMSAudioTrack';
import { HMSVideoTrack } from './HMSVideoTrack';
import { HMSRoom } from './HMSRoom';
import { HMSPeer } from './HMSPeer';
import { HMSLocalPeer } from './HMSLocalPeer';
import { HMSRemotePeer } from './HMSRemotePeer';
import { HMSAudioTrackSettings } from './HMSAudioTrackSettings';
import { HMSVideoTrackSettings } from './HMSVideoTrackSettings';
import { HMSLocalVideoTrack } from './HMSLocalVideoTrack';
import { HMSLocalAudioTrack } from './HMSLocalAudioTrack';
import { HMSRole } from './HMSRole';
import { HMSRoleChangeRequest } from './HMSRoleChangeRequest';
import { HMSChangeTrackStateRequest } from './HMSChangeTrackStateRequest';
import { HMSVideoResolution } from './HMSVideoResolution';
import { HMSRTCStats } from './HMSRTCStats';
import { HMSRTCStatsReport } from './HMSRTCStatsReport';
import { HMSRemoteAudioTrack } from './HMSRemoteAudioTrack';
import { HMSRemoteVideoTrack } from './HMSRemoteVideoTrack';
import { HMSSpeaker } from './HMSSpeaker';
import { HMSHLSRecordingState } from './HMSHLSRecordingState';
import { HMSNetworkQuality } from './HMSNetworkQuality';
import { HMSBrowserRecordingState } from './HMSBrowserRecordingState';
import { HMSHLSStreamingState } from './HMSHLSStreamingState';
import { HMSHLSVariant } from './HMSHLSVariant';
import { HMSRtmpStreamingState } from './HMSRtmpStreamingState';
import { HMSServerRecordingState } from './HMSServerRecordingState';
import { HMSMessage } from './HMSMessage';
import { HMSMessageRecipient } from './HMSMessageRecipient';
import { HMSException } from './HMSException';

interface InitialData {
  roles: Record<string, HMSRole>;
}

export class HMSEncoder {
  private static data: InitialData = { roles: {} };

  static clearData() {
    this.data = { roles: {} };
  }

  static encodeHmsRoom(room: HMSRoom, id: string) {
    const encodedObj = {
      id: room?.id,
      sessionId: room?.sessionId,
      metaData: room?.metaData,
      name: room?.name,
      peerCount: room?.peerCount,
      peers: HMSEncoder.encodeHmsPeers(room?.peers, id),
      browserRecordingState: HMSEncoder.encodeBrowserRecordingState(
        room?.browserRecordingState
      ),
      rtmpHMSRtmpStreamingState: HMSEncoder.encodeRTMPStreamingState(
        room?.rtmpHMSRtmpStreamingState
      ),
      serverRecordingState: HMSEncoder.encodeServerRecordingState(
        room?.serverRecordingState
      ),
      hlsStreamingState: HMSEncoder.encodeHLSStreamingState(
        room?.hlsStreamingState
      ),
      hlsRecordingState: HMSEncoder.encodeHLSRecordingState(
        room?.hlsRecordingState
      ),
      localPeer: HMSEncoder.encodeHmsLocalPeer(room?.localPeer, id),
    };

    return new HMSRoom(encodedObj);
  }

  static encodeHmsPeers(peers: any, id: string) {
    const encodedPeers: HMSPeer[] = [];
    peers?.map((peer: any) => {
      encodedPeers.push(HMSEncoder.encodeHmsPeer(peer, id));
    });

    return encodedPeers;
  }

  static encodeHmsPeer(peer: any, id: string) {
    const encodedObj = {
      peerID: peer?.peerID,
      name: peer?.name || '',
      isLocal: peer?.isLocal,
      customerUserID: peer?.customerUserID,
      customerDescription: peer?.customerDescription || undefined,
      metadata: peer?.metadata,
      role: HMSEncoder.encodeHmsRole(peer?.role),
      networkQuality: peer?.networkQuality
        ? HMSEncoder.encodeHMSNetworkQuality(peer?.networkQuality)
        : undefined,
      audioTrack: peer?.audioTrack
        ? HMSEncoder.encodeHmsAudioTrack(peer?.audioTrack, id)
        : undefined,
      videoTrack: peer?.videoTrack
        ? HMSEncoder.encodeHmsVideoTrack(peer?.videoTrack, id)
        : undefined,
      auxiliaryTracks: Array.isArray(peer?.auxiliaryTracks)
        ? HMSEncoder.encodeHmsAuxiliaryTracks(peer?.auxiliaryTracks, id)
        : undefined,
    };

    return new HMSPeer(encodedObj);
  }

  static encodeHmsAudioTrack(track: any, id: string) {
    const encodedObj = {
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      id: id,
      type: track?.type,
    };

    return new HMSAudioTrack(encodedObj);
  }

  static encodeHmsVideoTrack(track: any, id: string) {
    const encodedObj = {
      id: id,
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      isDegraded: track?.isDegraded,
      type: track?.type,
    };

    return new HMSVideoTrack(encodedObj);
  }

  static encodeHmsAuxiliaryTracks(tracks: any, id: string) {
    const auxiliaryTracks: HMSTrack[] = [];
    tracks?.map((track: any) => {
      auxiliaryTracks.push(HMSEncoder.encodeHmsTrack(track, id));
    });
    return auxiliaryTracks;
  }

  static encodeHmsTrack(track: any, id: string) {
    const encodedObj = {
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      id: id,
      type: track?.type,
    };

    return new HMSTrack(encodedObj);
  }

  static encodeHmsLocalPeer(peer: any, id: string) {
    const encodedObj = {
      peerID: peer?.peerID,
      name: peer?.name,
      isLocal: true,
      customerUserID: peer?.customerUserID,
      customerDescription: peer?.customerDescription || undefined,
      metadata: peer?.metadata || undefined,
      role: HMSEncoder.encodeHmsRole(peer?.role),
      networkQuality: peer?.networkQuality
        ? HMSEncoder.encodeHMSNetworkQuality(peer?.networkQuality)
        : undefined,
      audioTrack: peer?.audioTrack
        ? HMSEncoder.encodeHmsAudioTrack(peer?.audioTrack, id)
        : undefined,
      videoTrack: peer?.videoTrack
        ? HMSEncoder.encodeHmsVideoTrack(peer?.videoTrack, id)
        : undefined,
      auxiliaryTracks: Array.isArray(peer?.auxiliaryTracks)
        ? HMSEncoder.encodeHmsAuxiliaryTracks(peer?.auxiliaryTracks, id)
        : undefined,
      localAudioTrackData: peer?.localAudioTrackData?.trackId
        ? {
            id: id,
            trackId: peer?.localAudioTrackData?.trackId,
            source: peer?.localAudioTrackData?.source,
            trackDescription: peer?.localAudioTrackData?.trackDescription,
            isMute: peer?.localAudioTrackData?.isMute,
            settings: peer?.localAudioTrackData?.settings
              ? HMSEncoder.encodeHmsAudioTrackSettings(
                  peer?.localAudioTrackData?.settings
                )
              : undefined,
            type: peer?.localAudioTrackData?.type,
          }
        : undefined,
      localVideoTrackData: peer?.localVideoTrackData?.trackId
        ? {
            id: id,
            trackId: peer?.localVideoTrackData?.trackId,
            source: peer?.localVideoTrackData?.source,
            trackDescription: peer?.localVideoTrackData?.trackDescription,
            isMute: peer?.localVideoTrackData?.isMute,
            settings: peer?.localVideoTrackData?.settings
              ? HMSEncoder.encodeHmsVideoTrackSettings(
                  peer?.localVideoTrackData?.settings
                )
              : undefined,
            type: peer?.localVideoTrackData?.type,
          }
        : undefined,
    };

    return new HMSLocalPeer(encodedObj);
  }

  static encodeHmsAudioTrackSettings(settings: any) {
    const encodedObj = {
      useHardwareEchoCancellation: settings?.useHardwareAcousticEchoCanceler,
      initialState: settings?.initialState,
    };

    return new HMSAudioTrackSettings(encodedObj);
  }

  static encodeHmsVideoTrackSettings(settings: any) {
    const encodedObj = {
      initialState: settings?.initialState,
      forceSoftwareDecoder: settings?.forceSoftwareDecoder,
      simulcastSettings: settings?.simulcastSettings,
      cameraFacing: settings?.cameraFacing,
      disableAutoResize: settings?.disableAutoResize,
    };

    return new HMSVideoTrackSettings(encodedObj);
  }

  static encodeHmsVideoResolution(resolution: any) {
    const encodedObj = {
      height: resolution?.height,
      width: resolution?.width,
    };

    return new HMSVideoResolution(encodedObj);
  }

  static encodeHmsLocalAudioTrack(track: any, id: string) {
    const encodedObj = {
      id: id,
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      settings: track?.settings
        ? HMSEncoder.encodeHmsAudioTrackSettings(track?.settings)
        : undefined,
      type: track?.type,
    };

    return new HMSLocalAudioTrack(encodedObj);
  }

  static encodeHmsLocalVideoTrack(track: any, id: string) {
    const encodedObj = {
      id: id,
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      settings: track?.settings
        ? HMSEncoder.encodeHmsVideoTrackSettings(track?.settings)
        : undefined,
      type: track?.type,
    };

    return new HMSLocalVideoTrack(encodedObj);
  }

  static encodeHmsRemotePeers(peers: any, id: string) {
    const hmsPeers: HMSRemotePeer[] = [];

    peers.map((peer: any) => {
      const encodedPeer = HMSEncoder.encodeHmsRemotePeer(peer, id);

      hmsPeers.push(encodedPeer);
    });

    return hmsPeers;
  }

  static encodeHmsRemotePeer(peer: any, id: string) {
    const encodedObj = {
      peerID: peer?.peerID,
      name: peer?.name,
      isLocal: false,
      customerUserID: peer?.customerUserID,
      customerDescription: peer.customerDescription,
      metadata: peer.metadata,
      role: HMSEncoder.encodeHmsRole(peer?.role),
      networkQuality: peer?.networkQuality
        ? HMSEncoder.encodeHMSNetworkQuality(peer?.networkQuality)
        : undefined,
      audioTrack: peer?.audioTrack
        ? HMSEncoder.encodeHmsAudioTrack(peer?.audioTrack, id)
        : undefined,
      videoTrack: peer?.videoTrack
        ? HMSEncoder.encodeHmsVideoTrack(peer.videoTrack, id)
        : undefined,
      auxiliaryTracks: Array.isArray(peer?.auxiliaryTracks)
        ? HMSEncoder.encodeHmsAuxiliaryTracks(peer?.auxiliaryTracks, id)
        : undefined,
      remoteAudioTrackData: peer?.remoteAudioTrackData?.trackId
        ? {
            id: id,
            trackId: peer?.remoteAudioTrackData?.trackId,
            source: peer?.remoteAudioTrackData?.source,
            trackDescription: peer?.remoteAudioTrackData?.trackDescription,
            isMute: peer?.remoteAudioTrackData?.isMute,
            playbackAllowed: peer?.remoteAudioTrackData?.playbackAllowed,
          }
        : undefined,
      remoteVideoTrackData: peer?.remoteVideoTrackData?.trackId
        ? {
            id: id,
            trackId: peer?.remoteVideoTrackData?.trackId,
            source: peer?.remoteVideoTrackData?.source,
            trackDescription: peer?.remoteVideoTrackData?.trackDescription,
            layer: peer?.remoteVideoTrackData?.layer,
            isMute: peer?.remoteVideoTrackData?.isMute,
            playbackAllowed: peer?.remoteVideoTrackData?.playbackAllowed,
          }
        : undefined,
    };

    return new HMSRemotePeer(encodedObj);
  }

  static encodeHmsRemoteAudioTrack(track: any, id: string) {
    const encodedObj = {
      id: id,
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      isMute: track?.isMute,
      playbackAllowed: track?.playbackAllowed,
    };

    return new HMSRemoteAudioTrack(encodedObj);
  }

  static encodeHmsRemoteVideoTrack(track: any, id: string) {
    const encodedObj = {
      id: id,
      trackId: track?.trackId,
      source: track?.source,
      trackDescription: track?.trackDescription,
      layer: track?.layer,
      isMute: track?.isMute,
      playbackAllowed: track?.playbackAllowed,
    };

    return new HMSRemoteVideoTrack(encodedObj);
  }

  static encodeHmsPreviewTracks(previewTracks: any[], id: string) {
    return previewTracks?.map((track) => {
      return this.encodeHmsTrack(track, id);
    });
  }

  static encodeHmsRoles(roles: any[]) {
    const encodedRoles: HMSRole[] = [];

    roles?.map((item: any) => {
      encodedRoles.push(HMSEncoder.encodeHmsRole(item));
    });

    return encodedRoles;
  }

  static encodeHmsRole(role: any) {
    if (!role) {
      return new HMSRole(role);
    }

    const rolesCache = this.data.roles;

    const cachedRole = rolesCache[role.name];

    // create new HMSRole instance, if cached role does not exist OR `role.publishSettings?.allowed` does not exist
    if (!cachedRole || !cachedRole.publishSettings?.allowed) {
      rolesCache[role.name] = new HMSRole(role);
    }

    return rolesCache[role.name];
  }

  static encodeHmsRoleChangeRequest(data: any, id: string) {
    const encodedRoleChangeRequest = {
      requestedBy: data.requestedBy
        ? HMSEncoder.encodeHmsPeer(data.requestedBy, id)
        : undefined,
      suggestedRole: HMSEncoder.encodeHmsRole(data.suggestedRole),
    };

    return new HMSRoleChangeRequest(encodedRoleChangeRequest);
  }

  static encodeHmsChangeTrackStateRequest(
    data: HMSChangeTrackStateRequest,
    id: string
  ) {
    const encodedChangeTrackStateRequest = {
      requestedBy: data?.requestedBy
        ? HMSEncoder.encodeHmsPeer(data?.requestedBy, id)
        : undefined,
      trackType: data.trackType,
      mute: data.mute,
    };

    return new HMSChangeTrackStateRequest(encodedChangeTrackStateRequest);
  }

  static encodeRTCStats(data: any) {
    let video = this.encodeRTCStatsUnit(data?.video);
    let audio = this.encodeRTCStatsUnit(data?.audio);
    let combined = this.encodeRTCStatsUnit(data?.combined);

    return new HMSRTCStatsReport({ video, audio, combined });
  }

  static encodeRTCStatsUnit(data: any) {
    return new HMSRTCStats({
      bitrateReceived: data?.bitrateReceived,
      bitrateSent: data?.bitrateSent,
      bytesReceived: data?.bytesReceived,
      bytesSent: data?.bytesSent,
      packetsLost: data?.packetsLost,
      packetsReceived: data?.packetsReceived,
      roundTripTime: data?.roundTripTime,
    });
  }

  static encodeHmsSpeakers(data: any, id: string) {
    let encodedSpeakers: Array<HMSSpeaker> = [];

    data?.map((item: any) => {
      encodedSpeakers.push(HMSEncoder.encodeHmsSpeaker(item, id));
    });

    return encodedSpeakers;
  }

  static encodeHmsSpeaker(data: any, id: string) {
    return new HMSSpeaker({
      level: data?.level,
      peer: HMSEncoder.encodeHmsPeer(data?.peer, id),
      track: HMSEncoder.encodeHmsTrack(data?.track, id),
    });
  }

  static encodeBrowserRecordingState(data: any) {
    return new HMSBrowserRecordingState({
      running: data?.running || false,
      startedAt: data?.startedAt
        ? new Date(parseInt(data?.startedAt))
        : undefined,
      stoppedAt: data?.stoppedAt
        ? new Date(parseInt(data?.stoppedAt))
        : undefined,
      error: data?.error || undefined,
    });
  }

  static encodeServerRecordingState(data: any) {
    return new HMSServerRecordingState({
      running: data?.running || false,
      error: data?.error || undefined,
      startedAt: data?.startedAt
        ? new Date(parseInt(data?.startedAt))
        : undefined,
    });
  }

  static encodeRTMPStreamingState(data: any) {
    return new HMSRtmpStreamingState({
      running: data?.running || false,
      startedAt: data?.startedAt
        ? new Date(parseInt(data?.startedAt))
        : undefined,
      stoppedAt: data?.stoppedAt
        ? new Date(parseInt(data?.stoppedAt))
        : undefined,
      error: data?.error || undefined,
    });
  }

  static encodeHLSStreamingState(data: any) {
    return new HMSHLSStreamingState({
      running: data?.running || false,
      variants: Array.isArray(data?.variants)
        ? this.encodeHLSVariants(data?.variants)
        : undefined,
    });
  }

  static encodeHLSRecordingState(data: any) {
    if (data) {
      return new HMSHLSRecordingState({
        running: data?.running || false,
        startedAt: data?.startedAt
          ? new Date(parseInt(data?.startedAt))
          : undefined,
        singleFilePerLayer: data?.singleFilePerLayer || false,
        videoOnDemand: data?.videoOnDemand || false,
      });
    } else {
      return undefined;
    }
  }

  static encodeHLSVariants(data: any) {
    let variants: HMSHLSVariant[] = [];

    data?.map((item: any) => {
      let variant = new HMSHLSVariant({
        hlsStreamUrl: item.hlsStreamUrl,
        meetingUrl: item.meetingUrl,
        metadata: item?.metaData ? item?.metadata : undefined,
        startedAt: item?.startedAt
          ? new Date(parseInt(item?.startedAt))
          : undefined,
      });
      variants.push(variant);
    });

    return variants;
  }

  static encodeHMSNetworkQuality(data: any) {
    if (data) {
      return new HMSNetworkQuality({
        downlinkQuality: data?.downlinkQuality,
      });
    } else {
      return undefined;
    }
  }

  static encodeHMSMessage(data: any, id: string) {
    if (data) {
      return new HMSMessage({
        message: data?.message,
        type: data?.type,
        time: new Date(parseInt(data?.time)),
        sender: this.encodeHmsPeer(data?.sender, id),
        recipient: this.encodeHMSMessageRecipient(data?.recipient, id),
      });
    } else {
      return undefined;
    }
  }

  static encodeHMSMessageRecipient(data: any, id: string) {
    return new HMSMessageRecipient({
      recipientType: data?.recipientType,
      recipientPeer: data?.recipientPeer
        ? this.encodeHmsPeer(data.recipientPeer, id)
        : undefined,
      recipientRoles: Array.isArray(data?.recipientRoles)
        ? this.encodeHmsRoles(data.recipientRoles)
        : [],
    });
  }

  static encodeHMSException(data: any) {
    return new HMSException({
      code: data?.error?.code,
      description: data?.error?.description,
      message: data?.error?.message,
      name: data?.error?.name,
      action: data?.error?.action,
      isTerminal: data?.error?.isTerminal,
      canRetry: data?.error?.canRetry,
    });
  }
}
