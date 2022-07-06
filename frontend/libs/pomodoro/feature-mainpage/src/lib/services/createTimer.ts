import { interval, merge, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  startWith,
  switchScan,
  takeWhile,
  switchMap,
} from 'rxjs/operators';

export type Phase = string;

export type TimerState<TPhase extends Phase> = {
  secondsLeft: number;
  phase: TPhase;
  running: boolean;
};

export type TimerAction = 'start' | 'pause' | 'reset' | 'skip';

export type TimerConfig<TPhase extends Phase> = {
  startPhase: TPhase;
  phaseDurations: { [key in TPhase]: number };
  nextPhase: (phase: TPhase) => TPhase;
};

export function createTimer<TPhase extends Phase>(
  config$: Observable<TimerConfig<TPhase>>,
  action$: Observable<TimerAction>
): Observable<TimerState<TPhase> | undefined> {
  return config$
    .pipe(
      switchMap((config: TimerConfig<TPhase>) => {
        const initialState = {
          secondsLeft: config.phaseDurations[config.startPhase],
          phase: config.startPhase,
          running: false,
        };
        return action$
          .pipe(
            switchScan((acc: TimerState<TPhase>, curr: TimerAction) => {
              if (curr === 'start' && !acc.running) {
                return interval(1000)
                  .pipe(
                    map((timePassed) => ({
                      ...acc,
                      secondsLeft: acc.secondsLeft - (timePassed + 1),
                      running: true,
                    }))
                  )
                  .pipe(
                    startWith({
                      ...acc,
                      running: true,
                    })
                  )
                  .pipe(takeWhile((value) => value.secondsLeft >= 0))
                  .pipe(
                    map((value) => {
                      return {
                        ...acc,
                        ...value,
                        ...(value.secondsLeft === 0 && {
                          secondsLeft:
                            config.phaseDurations[config.nextPhase(acc.phase)],
                          running: false,
                          phase: config.nextPhase(acc.phase),
                        }),
                      };
                    })
                  );
              } else if (curr === 'pause' && acc.running) {
                return of({ ...acc, running: false });
              } else if (curr === 'reset') {
                return of({
                  ...acc,
                  running: false,
                  secondsLeft: config.phaseDurations[acc.phase],
                });
              } else if (curr === 'skip') {
                const next = config.nextPhase(acc.phase);
                return of({
                  ...acc,
                  running: false,
                  secondsLeft: config.phaseDurations[next],
                  phase: next,
                });
              }
              return of(acc);
            }, initialState)
          )
          .pipe(startWith(initialState));
      })
    )
    .pipe(distinctUntilChanged());
}
