// TODO: write marble tests
import { combineLatest, interval, Observable, of, Subject } from 'rxjs';
import { map, scan, switchScan, takeWhile } from 'rxjs/operators';

export type TimerState = {
  secondsLeft: number;
  running: boolean;
};

export type TimerActions = 'start' | 'pause' | 'reset';

export type TimerConfig = {
  startTime: number;
};

export function createTimer(
  actionSubject: Subject<TimerActions>,
  configSubject: Subject<TimerConfig>
): Observable<TimerState | undefined> {
  return combineLatest(
    configSubject.pipe(
      map((config) => ({
        secondsLeft: config.startTime,
        running: false,
      }))
    ),
    actionSubject
  ).pipe(
    switchScan((acc, [initialState, action]) => {
      if (action === 'start') {
        return interval(1000)
          .pipe(
            scan(
              (accTimerState) =>
                accTimerState && {
                  secondsLeft: accTimerState.secondsLeft - 1,
                  running: true,
                },
              acc
            )
          )
          .pipe(
            takeWhile(
              (newState: TimerState | undefined) =>
                newState !== undefined && newState.secondsLeft >= 0
            )
          );
      } else if (action === 'pause') {
        return of(acc);
      } else {
        return of(initialState);
      }
    }, undefined as undefined | TimerState)
  );
}
