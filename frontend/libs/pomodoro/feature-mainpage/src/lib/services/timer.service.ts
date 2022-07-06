/* import {
  tap,
  map,
  Observable,
  scan,
  Subject,
  switchMap,
  combineLatest,
  startWith,
  distinctUntilChanged,
  switchScan,
  switchAll,
  shareReplay,
} from 'rxjs';
import {
  createTimer,
  TimerAction,
  TimerConfig,
  TimerState,
} from './createTimer';

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
  config$: Observable<IntervalTimerConfig>,
  action$: Observable<IntervalTimerAction>
): Observable<IntervalTimerState | undefined> {
  return null as any;
}

 */