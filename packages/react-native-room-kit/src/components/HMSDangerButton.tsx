import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useHMSRoomColorPalette, useHMSRoomStyleSheet } from '../hooks-util';
import { HMSBaseButton } from './HMSBaseButton';

export interface HMSDangerButtonProps {
  title: string;
  loading: boolean;
  onPress(): void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  leftComponent?: React.ReactElement | null;
}

export const HMSDangerButton: React.FC<HMSDangerButtonProps> = ({
  title,
  loading,
  onPress,
  style,
  disabled,
  leftComponent,
}) => {
  const {
    alert_error_dim: alertErrorDimColor,
    alert_error_brighter: alertErrorBrighterColor,
  } = useHMSRoomColorPalette();

  const hmsRoomStyles = useHMSRoomStyleSheet((theme, typography) => ({
    button: {
      backgroundColor: theme.palette.alert_error_default,
    },
    disabledButton: {
      backgroundColor: theme.palette.alert_error_dim,
    },
    buttonText: {
      color: theme.palette.alert_error_brighter,
      fontFamily: `${typography.font_family}-SemiBold`,
    },
    disabledText: {
      color: theme.palette.alert_error_bright,
    },
  }));

  return (
    <HMSBaseButton
      loaderColor={alertErrorBrighterColor}
      loading={loading}
      onPress={onPress}
      title={title}
      underlayColor={alertErrorDimColor}
      disabled={disabled}
      leftComponent={leftComponent}
      style={[
        hmsRoomStyles.button,
        disabled ? hmsRoomStyles.disabledButton : null,
        style,
      ]}
      textStyle={[
        hmsRoomStyles.buttonText,
        disabled ? hmsRoomStyles.disabledText : null,
      ]}
    />
  );
};
