import { Injectable } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { TimerActions, TimerConfig, TimerState } from './timer';

// subject ot handle incoming timerEvents
// timerBehaviorSubject pipes this subject and returns according timerValues

// first step: outsource basic timer functionality, this service extends to specific pomodoro states

interface IntervalTimerState extends TimerState {
  phase: 'work' | 'break' | 'longBreak';
}

type IntervalTimerActions = TimerActions | 'next';

type IntervalTimerConfig = TimerConfig & {
  phaseDurations: {
    work: number;
    break: number;
    longBreak: number;
  };
};

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  intervalTimer$: Observable<IntervalTimerState> | undefined;

  actionSubject: Subject<IntervalTimerActions> = new Subject();
  configSubject: Subject<IntervalTimerConfig> = new Subject();

  constructor() {
    this.intervalTimer$ = combineLatest(
      this.configSubject,
      this.actionSubject
    ) as any;
  }
}
