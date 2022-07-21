import { Injectable } from '@angular/core';
import {
  createTimer,
  Phase,
  TimerAction,
  TimerConfig,
  TimerState,
} from 'libs/shared/ui-common/src/lib/functions/createTimer';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const INITIAL_TIMER_CONFIG: TimerConfig<Phase> = {
  startPhaseIndex: 0,
  phaseDurations: {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  },
  phaseOrder: ['work', 'break', 'work', 'break', 'work', 'longBreak'],
};


@Injectable()
export class TimerStore {
  private _timerState: BehaviorSubject<TimerState | undefined> =
    new BehaviorSubject(undefined as TimerState | undefined);
  private config$: Subject<TimerConfig<Phase>> = new Subject();
  private action$: Subject<TimerAction> = new Subject();

  get timerState(): Observable<TimerState | undefined> {
    return asObservable(this._timerState);
  }

  constructor() {
    createTimer(this.config$, this.action$, INITIAL_TIMER_CONFIG).subscribe(
      (state) => this._timerState.next(state)
    );
  }

  applyAction(action: TimerAction) {
    this.action$.next(action);
  }

  applyConfig(config: TimerConfig<Phase>) {
    this.config$.next(config);
  }
}

function asObservable<T>(subject: Subject<T>) {
  return new Observable<T>((fn) => subject.subscribe(fn));
}
