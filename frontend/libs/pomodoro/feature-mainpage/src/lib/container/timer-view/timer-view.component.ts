import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  createTimer,
  TimerAction,
  TimerConfig,
  TimerState,
} from '../../functions/createTimer';

type Phase = 'work' | 'break' | 'longBreak';

const INITIAL_TIMER_CONFIG: TimerConfig<Phase> = {
  startPhaseIndex: 0,
  phaseDurations: {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  },
  phaseOrder: ['work', 'break', 'work', 'break', 'work', 'longBreak'],
};

@Component({
  selector: 'pomodoro-mainpage-timer-view',
  templateUrl: './timer-view.component.html',
  styleUrls: ['./timer-view.component.scss'],
})
export class TimerViewComponent {
  timerState$: Observable<TimerState | undefined>;
  config$: Subject<TimerConfig<Phase>> = new Subject();
  action$: Subject<TimerAction> = new Subject();

  constructor() {
    this.timerState$ = createTimer(
      this.config$,
      this.action$,
      INITIAL_TIMER_CONFIG
    );
  }

  handleTimerAction(action: TimerAction) {
    this.action$.next(action);
  }
}
