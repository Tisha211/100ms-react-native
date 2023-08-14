import React from 'react';
import { Image, StyleSheet } from 'react-native';
import type { ImageProps } from 'react-native';

import { useHMSRoomStyle } from '../../hooks-util';

interface ThreeDotsIconProps extends Omit<ImageProps, 'source'> {
  stack: 'horizontal' | 'vertical';
}

export const ThreeDotsIcon: React.FC<ThreeDotsIconProps> = ({
  stack,
  style,
  ...restProps
}) => {
  const iconStyles = useHMSRoomStyle(theme => ({
    tintColor: theme.palette.on_surface_high
  }));

  return (
    <Image
      source={
        stack
          ? require('./assets/three-dots-vertical.png')
          : require('./assets/three-dots-vertical.png')
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
