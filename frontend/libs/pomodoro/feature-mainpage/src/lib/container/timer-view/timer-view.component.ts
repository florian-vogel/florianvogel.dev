import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  playTimer() {
    console.log('timer started');
  }

  pauseTimer() {
    console.log('timer paused');
  }

  resetTimer() {
    console.log('reset timer');
  }

  skipTimerPhase() {
    console.log('skip phase');
  }
}
