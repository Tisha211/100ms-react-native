import * as React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import type { HMSPeer } from '@100mslive/react-native-hms';

import type { RootState } from '../redux';
import { HMSLocalScreenshareNotification } from './HMSLocalScreenshareNotification';
import { HMSHandRaiseNotification } from './HMSHandRaiseNotification';
import { HMSRoleChangeDeclinedNotification } from './HMSRoleChangeDeclinedNotification';
import { NotificationTypes } from '../utils';

export interface HMSNotificationsProps {}

const LOCAL_SCREENSHARE_PAYLOAD = {
  id: NotificationTypes.LOCAL_SCREENSHARE,
  type: NotificationTypes.LOCAL_SCREENSHARE,
};

export const HMSNotifications: React.FC<HMSNotificationsProps> = () => {
  const isLocalScreenShared = useSelector(
    (state: RootState) => state.hmsStates.isLocalScreenShared
  );

  // notifications is a stack, first will appear last
  const notifications: (
    | typeof LOCAL_SCREENSHARE_PAYLOAD
    | { id: string; type: string; peer: HMSPeer }
  )[] = useSelector((state: RootState) => {
    // Latest notification will be at 0th index.
    const allNotifications = state.app.notifications;

    let list = [];

    if (isLocalScreenShared) {
      list.push(LOCAL_SCREENSHARE_PAYLOAD);

      // We are picking the latest notification always
      if (allNotifications.length > 0) {
        const firstNotification = allNotifications[0];

        const secondNotification =
          allNotifications.length > 1 ? allNotifications[1] : null;

        if (secondNotification) {
          list.push(secondNotification);
        }

        if (firstNotification) {
          list.push(firstNotification);
        }
      }
    } else if (allNotifications.length > 0) {
      const firstNotification = allNotifications[0];

      const secondNotification =
        allNotifications.length > 1 ? allNotifications[1] : null;

      const thirdNotification =
        allNotifications.length > 2 ? allNotifications[2] : null;

      if (thirdNotification) {
        list.push(thirdNotification);
      }

      if (secondNotification) {
        list.push(secondNotification);
      }

      if (firstNotification) {
        list.push(firstNotification);
      }
    }

    return list;
  }, shallowEqual);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.absoluteContainer,
        { paddingTop: (notifications.length - 1) * 16 },
      ]}
    >
      {notifications.map((notification, index, arr) => {
        const atTop = index === arr.length - 1;
        const atBottom = index === 0;
        return (
          <View
            key={notification.id}
            style={[
              {
                transform: [{ scale: getScale(arr.length, index) }],
              },
              atBottom ? null : styles.notificationWrapper,
              atBottom ? null : { bottom: index * 16 },
            ]}
          >
            {notification.type === NotificationTypes.LOCAL_SCREENSHARE ? (
              <HMSLocalScreenshareNotification />
            ) : notification.type === NotificationTypes.HAND_RAISE &&
              'peer' in notification ? (
              <HMSHandRaiseNotification
                id={notification.id}
                peer={notification.peer}
                autoDismiss={atTop}
                dismissDelay={20000}
              />
            ) : notification.type === NotificationTypes.ROLE_CHANGE_DECLINED &&
              'peer' in notification ? (
              <HMSRoleChangeDeclinedNotification
                id={notification.id}
                peerName={notification.peer.name}
                autoDismiss={atTop}
                dismissDelay={10000}
              />
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'relative',
    marginBottom: 8,
    width: '100%',
  },
  notificationWrapper: {
    position: 'absolute',
    width: '100%',
  },
});

const getScale = (totalItem: number, current: number): number => {
  if (totalItem === 1) {
    return 1;
  }

  if (totalItem === 2) {
    return [0.96, 1][current]!;
  }

  if (totalItem === 3) {
    return [0.94, 0.97, 1][current]!;
  }

  return 1;
};
