import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  TimerAction,
  TimerConfig,
  TimerState,
} from '../../../../../../shared/ui-common/src/lib/functions/createTimer';
import { TimerStore } from '../../services/timerStore.service';

type Phase = 'work' | 'break' | 'longBreak';

@Component({
  selector: 'pomodoro-mainpage-timer-view',
  templateUrl: './timer-view.component.html',
  styleUrls: ['./timer-view.component.scss'],
})
export class TimerViewComponent {
  timerState$: Observable<TimerState | undefined>;
  config$: Subject<TimerConfig<Phase>> = new Subject();
  action$: Subject<TimerAction> = new Subject();

  constructor(private timerStore: TimerStore) {
    this.timerState$ = this.timerStore.timerState;
  }

  handleTimerAction(action: TimerAction) {
    this.timerStore.applyAction(action);
  }
}
