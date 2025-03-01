import * as React from 'react';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { Footer } from './Footer';
import { AnimatedHLSFooter } from './AnimatedHLSFooter';
import { HLSChatView } from './HMSOverlayChatView';
import { useShowChatAndParticipants } from '../hooks-util';

interface HLSFooterProps {
  offset: SharedValue<number>;
}

export const HLSFooter: React.FC<HLSFooterProps> = ({ offset }) => {
  const { overlayChatVisible } = useShowChatAndParticipants();

  return (
    <AnimatedHLSFooter offset={offset} style={styles.animatedContainer}>
      {overlayChatVisible ? <HLSChatView /> : null}

      <Footer />
    </AnimatedHLSFooter>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
