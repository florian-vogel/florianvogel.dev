import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IntervalTimerAction,
  IntervalTimerState,
} from '../../services/timer.service';

@Component({
  selector: 'pomodoro-mainpage-timer-view',
  templateUrl: './timer-view.component.html',
  styleUrls: ['./timer-view.component.scss'],
})
export class TimerViewComponent {
  @Input()
  timerState$: Observable<IntervalTimerState> | undefined;

  @Output()
  timerActionEmitter = new EventEmitter<IntervalTimerAction>();

  handleTimerAction(action: IntervalTimerAction) {
    this.timerActionEmitter.emit(action);
  }
}
