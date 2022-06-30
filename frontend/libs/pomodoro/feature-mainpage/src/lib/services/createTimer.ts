import { interval, merge, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchScan,
  takeWhile,
} from 'rxjs/operators';

export type TimerState = {
  secondsLeft: number;
  running: boolean;
};

export type TimerAction = 'start' | 'pause' | 'reset';

export type TimerConfig = {
  startTime: number;
};

type UpdateTimer =
  | { type: 'config'; value: TimerConfig }
  | { type: 'action'; value: TimerAction };

export function createTimer(
  configSubject: Observable<TimerConfig>,
  actionSubject: Observable<TimerAction>
): Observable<TimerState | undefined> {
  return merge(
    configSubject.pipe(
      map((config) => ({ type: 'config', value: config } as UpdateTimer))
    ),
    actionSubject.pipe(
      map((action) => ({ type: 'action', value: action } as UpdateTimer))
    )
  )
    .pipe(
      switchScan(
        (
          acc: { state: TimerState; config: TimerConfig },
          curr:
            | { type: 'action'; value: TimerAction }
            | { type: 'config'; value: TimerConfig }
        ) => {
          if (curr.type === 'action') {
            if (curr.value === 'start' && !acc.state.running) {
              return interval(1000)
                .pipe(
                  map((timePassed) => ({
                    secondsLeft: acc.state.secondsLeft - (timePassed + 1),
                    running: true,
                  }))
                )
                .pipe(startWith({ ...acc.state, running: true }))
                .pipe(takeWhile((state) => state.secondsLeft >= 0))
                .pipe(
                  map(({ secondsLeft }) => ({
                    ...acc,
                    state: { secondsLeft, running: secondsLeft > 0 },
                  }))
                );
            } else if (curr.value === 'pause' && acc.state.running) {
              return of({ ...acc, state: { ...acc.state, running: false } });
            } else if (curr.value === 'reset') {
              return of({
                ...acc,
                state: {
                  running: false,
                  secondsLeft: acc.config.startTime,
                },
              });
            }
          } else if (curr.type === 'config') {
            return of({
              state: {
                running: false,
                secondsLeft: curr.value.startTime,
              },
              config: {
                startTime: curr.value.startTime,
              },
            });
          }
          return of(acc);
        },
        {
          state: { secondsLeft: 0, running: false },
          config: { startTime: 0 },
        }
      )
    )
    .pipe(map(({ state }) => state))
    .pipe(distinctUntilChanged());
}
