import { interval, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  switchScan,
  takeWhile,
  switchMap,
} from 'rxjs/operators';

export type Phase = string;

export type TimerState = {
  secondsLeft: number;
  running: boolean;
  phaseIndex: number;
};

export type TimerAction = 'start' | 'pause' | 'reset' | 'skip';

export type TimerConfig<TPhase extends Phase> = {
  startPhaseIndex: number;
  phaseDurations: { [key in TPhase]: number };
  phaseOrder: ReadonlyArray<TPhase>;
};

export function createTimer<TPhase extends Phase>(
  config$: Observable<TimerConfig<TPhase>>,
  action$: Observable<TimerAction>,
  initialConfig: TimerConfig<TPhase>
): Observable<TimerState | undefined> {
  return config$
    .pipe(startWith(initialConfig))
    .pipe(
      switchMap((config: TimerConfig<TPhase>) => {
        const startPhase =
          config.phaseOrder[config.startPhaseIndex % config.phaseOrder.length];
        const initialState = {
          secondsLeft: config.phaseDurations[startPhase],
          running: false,
          phaseIndex: config.startPhaseIndex,
        };
        return action$
          .pipe(
            switchScan((accState: TimerState, currentAction: TimerAction) => {
              if (currentAction === 'start' && !accState.running) {
                return interval(1000)
                  .pipe(
                    map((timePassed) => ({
                      ...accState,
                      secondsLeft: accState.secondsLeft - (timePassed + 1),
                      running: true,
                    }))
                  )
                  .pipe(
                    startWith({
                      ...accState,
                      running: true,
                    })
                  )
                  .pipe(takeWhile((value) => value.secondsLeft >= 0))
                  .pipe(
                    map((value) => {
                      const nextPhase =
                        (accState.phaseIndex + 1) % config.phaseOrder.length;
                      const phaseToAccess = config.phaseOrder[nextPhase];
                      return {
                        ...accState,
                        ...value,
                        ...(value.secondsLeft === 0 && {
                          secondsLeft: config.phaseDurations[phaseToAccess],
                          running: false,
                          phaseIndex: nextPhase,
                        }),
                      };
                    })
                  );
              } else if (currentAction === 'pause' && accState.running) {
                return of({ ...accState, running: false });
              } else if (currentAction === 'reset') {
                return of({
                  ...accState,
                  running: false,
                  secondsLeft:
                    config.phaseDurations[
                      config.phaseOrder[accState.phaseIndex]
                    ],
                });
              } else if (currentAction === 'skip') {
                const nextPhase =
                  (accState.phaseIndex + 1) % config.phaseOrder.length;
                const phaseToAccess = config.phaseOrder[nextPhase];
                return of({
                  ...accState,
                  running: false,
                  secondsLeft: config.phaseDurations[phaseToAccess],
                  phaseIndex: nextPhase,
                });
              }
              return of(accState);
            }, initialState)
          )
          .pipe(startWith(initialState));
      })
    )
    .pipe(distinctUntilChanged());
}
