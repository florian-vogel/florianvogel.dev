import { interval, merge, Observable, of, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  scan,
  startWith,
  switchScan,
  takeWhile,
} from 'rxjs/operators';

export type Phase = 'work' | 'break' | 'longBreak';

export type TimerState = {
  secondsLeft: number;
  phase: Phase;
  running: boolean;
};

export type TimerAction = 'start' | 'pause' | 'reset' | 'skip';

export type TimerConfig = {
  startPhase: Phase;
  phaseDurations: { [key in Phase]: number };
};

type UpdateTimer =
  | { type: 'config'; value: TimerConfig }
  | { type: 'action'; value: TimerAction };

export function createTimer(
  config$: Observable<TimerConfig>,
  action$: Observable<TimerAction>
): Observable<TimerState | undefined> {
  const nextPhaseSubject = new Subject();
  return merge(
    config$.pipe(
      map((config) => ({ type: 'config', value: config } as UpdateTimer))
    ),
    action$.pipe(
      map((action) => ({ type: 'action', value: action } as UpdateTimer))
    )
  )
    .pipe(
      switchScan(
        (
          acc: { state: TimerState; config: TimerConfig },
          curr: UpdateTimer
        ) => {
          if (curr.type === 'action') {
            if (curr.value === 'start' && !acc.state.running) {
              return interval(1000)
                .pipe(
                  map((timePassed) => ({
                    ...acc,
                    state: {
                      ...acc.state,
                      secondsLeft: acc.state.secondsLeft - (timePassed + 1),
                      running: true,
                    },
                  }))
                )
                .pipe(
                  startWith({ ...acc, state: { ...acc.state, running: true } })
                )
                .pipe(takeWhile((value) => value.state.secondsLeft >= 0))
                .pipe(
                  map((value) => {
                    return {
                      ...acc,
                      ...value,
                      state: {
                        ...value.state,
                        ...(value.state.secondsLeft === 0 && {
                          secondsLeft:
                            acc.config.phaseDurations[
                              nextPhase(acc.state.phase)
                            ],
                          running: false,
                          phase: nextPhase(acc.state.phase),
                        }),
                      },
                    };
                  })
                );
            } else if (curr.value === 'pause' && acc.state.running) {
              return of({ ...acc, state: { ...acc.state, running: false } });
            } else if (curr.value === 'reset') {
              return of({
                ...acc,
                state: {
                  ...acc.state,
                  running: false,
                  secondsLeft: acc.config.phaseDurations[acc.state.phase],
                },
              });
            } else if (curr.value === 'skip') {
              const next = nextPhase(acc.state.phase);
              return of({
                ...acc,
                state: {
                  ...acc.state,
                  running: false,
                  secondsLeft: acc.config.phaseDurations[next],
                  phase: next,
                },
              });
            }
          } else if (curr.type === 'config') {
            return of({
              state: {
                running: false,
                secondsLeft: curr.value.phaseDurations[curr.value.startPhase],
                phase: curr.value.startPhase,
              },
              config: {
                ...curr.value,
              },
            });
          }
          return of(acc);
        },
        {
          config: {
            startPhase: 'work',
            phaseDurations: {
              work: 25 * 60,
              break: 5 * 60,
              longBreak: 15 * 60,
            },
          },
          state: { secondsLeft: 25 * 60, phase: 'work', running: false },
        }
      )
    )
    .pipe(map((value) => value?.state))
    .pipe(distinctUntilChanged());
}

function nextPhase(curr: Phase): Phase {
  return curr === 'work' ? 'break' : curr === 'break' ? 'longBreak' : 'work';
}
