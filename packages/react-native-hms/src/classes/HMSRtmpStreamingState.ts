import type { HMSException } from './HMSException';

export class HMSRtmpStreamingState {
  running: boolean;
  error?: HMSException;
  startedAt?: Date;
  stoppedAt?: Date;

  constructor(params: {
    running: boolean;
    error?: HMSException;
    startedAt?: Date;
    stoppedAt?: Date;
  }) {
    this.running = params.running;
    this.error = params.error;
    this.startedAt = params.startedAt;
    this.stoppedAt = params.stoppedAt;
  }
}
