import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { ImageProps } from 'react-native';

import { useHMSRoomStyle } from '../../hooks-util';

interface MicIconProps extends Omit<ImageProps, 'source'> {
  muted: boolean;
}

export const MicIcon: React.FC<MicIconProps> = ({
  muted,
  style,
  ...restProps
}) => {
  const iconStyles = useHMSRoomStyle((theme) => ({
    tintColor: theme.palette.on_surface_high,
  }));

  return (
    <Image
      source={
        muted
          ? require('./assets/mic-muted.png')
          : require('./assets/mic-unmuted.png')
      }
      style={[styles.icon, iconStyles, style]}
      {...restProps}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
