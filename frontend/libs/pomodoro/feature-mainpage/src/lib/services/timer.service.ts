import { Injectable } from '@angular/core';
import {
  switchMap,
  combineLatest,
  filter,
  Observable,
  scan,
  map,
  Subject,
} from 'rxjs';
import { createTimer, TimerActions, TimerConfig, TimerState } from './timer';

// subject ot handle incoming timerEvents
// timerBehaviorSubject pipes this subject and returns according timerValues

// first step: outsource basic timer functionality, this service extends to specific pomodoro states

// darstellen, dass running von der Phase abhängt (running false -> phase: break | longBreak)

// how to pass input

export interface IntervalTimerState extends TimerState {
  phase: Phase;
}

type Phase = 'work' | 'break' | 'longBreak';

export type IntervalTimerActions = TimerActions | 'skip';

type IntervalTimerConfig = TimerConfig & {
  phaseDurations: { [key in Phase]: number };
};

function nextPhase(currentPhase: Phase): Phase {
  if (currentPhase === 'work') return 'break';
  else return 'work';
}

export function createIntervalTimer(
  actionEvents: Subject<IntervalTimerActions>,
  configEvents: Subject<IntervalTimerConfig>
): Observable<IntervalTimerState | undefined> {
  // idea: we have timer, which handles all actions exept 'next'
  // transform next to updatedConfigs (with values of new phase) and action pause
  // build interval timer state
  return null as any;
}
/* const standardTimerActions$ = actionEvents.pipe(
  map((val) => (val === 'skip' ? 'reset' : val))
);
const nextPhaseSubject = new Subject<Phase>();
const standardTimerConfig$ = combineLatest(
  nextPhaseSubject,
  configEvents
).pipe(
  map(([phase, config]) => ({ startTime: config.phaseDurations[phase] }))
);
return combineLatest(
  actionEvents,
  configEvents,
  createTimer(standardTimerActions$, standardTimerConfig$)
).pipe(
  scan(
    (acc, [action, config, timerData]) => {
      const newPhase = action === 'skip' ? nextPhase(acc.phase) : acc.phase;
      nextPhaseSubject.next(newPhase);
      return {
        ...acc,
        ...timerData,
        ...(action === 'skip' && {
          phase: nextPhase(acc.phase),
          secondsLeft: config.phaseDurations[nextPhase(acc.phase)],
        }),
      };
    },
    { secondsLeft: 0, running: false, phase: 'work' } as IntervalTimerState
  ) */

/* intervalTimerEvents: Subject<IntervalTimerActions> = new Subject();
intervalTimer$: Observable<IntervalTimerState> | undefined;
private timer$: Observable<TimerState | undefined>;

action$: Observable<IntervalTimerActions> = new Observable();

// config types make no sense yet
config$: Observable<IntervalTimerConfig> = new Observable();

constructor() {
  const timerConfig: Observable<TimerConfig> = combineLatest(
    this.config$,
    this.action$.pipe(filter((val) => val === 'next'))
  ).pipe(
    scan(
      (acc, [config, action]) => {
        const newPhase: Phase = action ? nextPhase(acc.phase) : acc.phase;
        return {
          phase: newPhase,
          startTime: config.phaseDurations[newPhase],
        };
      },
      { phase: 'work', startTime: 0 } as { phase: Phase; startTime: number }
    )
  );

  const timerControlAction: Observable<TimerActions> = this.action$.pipe(
    map((val) => (val !== 'next' ? val : 'pause'))
  );

  this.intervalTimer$ = createTimer(timerControlAction, timerConfig);
} */
