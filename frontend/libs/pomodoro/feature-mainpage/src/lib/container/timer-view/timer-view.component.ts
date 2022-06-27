import { Component, Input } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  createIntervalTimer,
  IntervalTimerActions,
  IntervalTimerState,
} from '../../services/timer.service';

@Component({
  selector: 'pomodoro-mainpage-timer-view',
  templateUrl: './timer-view.component.html',
  styleUrls: ['./timer-view.component.scss'],
})
export class TimerViewComponent {
  @Input()
  set timerRunning(input: Observable<boolean> | null | undefined) {
    this.timerRunning$ = input;
  }

  public timerRunning$: Observable<boolean> | null | undefined = of(true);
  public timer$: Observable<IntervalTimerState>;
  private timerEvents: Subject<IntervalTimerActions> = new Subject();

  constructor() {
    this.timer$ = null as any;
    /*     this.timer$ = createIntervalTimer(this.timerEvents); */
  }

  handleTimerAction(action: IntervalTimerActions) {
    this.timerEvents.next(action);
  }
}
