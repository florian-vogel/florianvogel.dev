import { Observable } from 'rxjs';
import { TimerAction, TimerState } from './createTimer';

export interface IntervalTimerState extends TimerState {
  phase: Phase;
}

export type Phase = 'work' | 'break' | 'longBreak';

export type IntervalTimerAction = TimerAction | 'skip';

type IntervalTimerConfig = {
  startPhase: Phase;
  phaseDurations: { [key in Phase]: number };
};

export function createIntervalTimer(
  config: Observable<IntervalTimerConfig>,
  action: Observable<IntervalTimerAction>
): Observable<IntervalTimerState | undefined> {
  console.log(config, action);
  return null as unknown as Observable<IntervalTimerState | undefined>;
}
