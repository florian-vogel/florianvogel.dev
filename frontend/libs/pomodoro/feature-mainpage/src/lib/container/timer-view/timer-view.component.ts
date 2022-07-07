import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable, of, tap, Subject } from 'rxjs';
import {
  createTimer,
  TimerAction,
  TimerConfig,
  TimerState,
} from '../../services/createTimer';

type Phase = 'work' | 'break' | 'longBreak';

function nextTimerPhase(phase: Phase): Phase {
  return phase === 'work' ? 'break' : phase === 'break' ? 'longBreak' : 'work';
}

const initialTimerConfig: TimerConfig<Phase> = {
  startPhase: 'work',
  phaseDurations: {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  },
  nextPhase: nextTimerPhase,
};

@Component({
  selector: 'pomodoro-mainpage-timer-view',
  templateUrl: './timer-view.component.html',
  styleUrls: ['./timer-view.component.scss'],
})
export class TimerViewComponent {
  timerState$: Observable<TimerState<Phase> | undefined>;
  config$: Subject<TimerConfig<Phase>> = new Subject();
  action$: Subject<TimerAction> = new Subject();

  constructor() {
    this.timerState$ = createTimer(
      this.config$,
      this.action$,
      initialTimerConfig
    );
  }

  handleTimerAction(action: TimerAction) {
    this.action$.next(action);
  }
}
