import { Injectable } from '@angular/core';
import { asObservable } from '@florianvogel-dev/shared/util-common';
import * as createTimer from '@florianvogel-dev/shared/ui-common';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const INITIAL_TIMER_CONFIG: createTimer.TimerConfig<createTimer.Phase> = {
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
  private _timerState: BehaviorSubject<createTimer.TimerState | undefined> =
    new BehaviorSubject(undefined as createTimer.TimerState | undefined);
  private config$: Subject<createTimer.TimerConfig<createTimer.Phase>> =
    new Subject();
  private action$: Subject<createTimer.TimerAction> = new Subject();

  get timerState(): Observable<createTimer.TimerState | undefined> {
    return asObservable(this._timerState);
  }

  constructor() {
    createTimer
      .createTimer(this.config$, this.action$, INITIAL_TIMER_CONFIG)
      .subscribe((state) => this._timerState.next(state));
  }

  applyAction(action: createTimer.TimerAction) {
    this.action$.next(action);
  }

  applyConfig(config: createTimer.TimerConfig<createTimer.Phase>) {
    this.config$.next(config);
  }
}
