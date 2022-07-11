import { TestScheduler } from 'rxjs/testing';
import { createTimer, TimerAction, TimerConfig } from './createTimer';
import { Observable } from 'rxjs';

type TestTimerPhase = 'work' | 'break' | 'longBreak';

const initialTestTimerConfig: TimerConfig<TestTimerPhase> = {
  startPhaseIndex: 0,
  phaseDurations: {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  },
  phaseOrder: ['work', 'break', 'work', 'break', 'work', 'longBreak'],
};

describe('createTimer function', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('timer updates config properly', () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i----j-',
        action: '  -------',
        expected: '(xi)-j-',
      };
      const values = {
        config: {
          i: initialTestTimerConfig,
          j: {
            ...initialTestTimerConfig,
            phaseDurations: {
              ...initialTestTimerConfig.phaseDurations,
              work: 50 * 60,
            },
          },
        },
        expected: {
          x: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          i: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          j: { secondsLeft: 50 * 60, running: false, phaseIndex: 0 },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action
      ) as unknown as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$, initialTestTimerConfig);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  const smallDurationConfig: TimerConfig<TestTimerPhase> = {
    startPhaseIndex: 0,
    phaseDurations: {
      work: 3,
      break: 2,
      longBreak: 3,
    },
    phaseOrder: ['work', 'break'], // ...
  };

  it("when receiving 'start' action timer starts countdown", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  -------s',
        expected: '(xi)---(a 997ms ) (b 997ms ) (c 997ms ) d',
      };
      const values = {
        config: {
          i: smallDurationConfig,
        },
        action: { s: 'start' },
        expected: {
          x: { secondsLeft: 3, running: false, phaseIndex: 0 },
          i: { secondsLeft: 3, running: false, phaseIndex: 0 },
          a: { secondsLeft: 3, running: true, phaseIndex: 0 },
          b: { secondsLeft: 2, running: true, phaseIndex: 0 },
          c: { secondsLeft: 1, running: true, phaseIndex: 0 },
          d: { secondsLeft: 2, running: false, phaseIndex: 1 },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action,
        values.action
      ) as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$, smallDurationConfig);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("when receiving 'pause' action timer stopps running", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i ',
        action: '  ------s  1500ms             p',
        expected: '(xi)--(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: initialTestTimerConfig,
        },
        action: { s: 'start', p: 'pause' },
        expected: {
          x: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          i: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          a: { secondsLeft: 25 * 60, running: true, phaseIndex: 0 },
          b: { secondsLeft: 25 * 60 - 1, running: true, phaseIndex: 0 },
          c: { secondsLeft: 25 * 60 - 1, running: false, phaseIndex: 0 },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action,
        values.action
      ) as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$, initialTestTimerConfig);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("when receiving 'reset' action timer resets to config of current phase and stops running", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  ------s  1500ms             r',
        expected: '(xi)--(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: initialTestTimerConfig,
        },
        action: { s: 'start', r: 'reset' },
        expected: {
          x: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          i: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          a: { secondsLeft: 25 * 60, running: true, phaseIndex: 0 },
          b: { secondsLeft: 25 * 60 - 1, running: true, phaseIndex: 0 },
          c: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action,
        values.action
      ) as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$, initialTestTimerConfig);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("when receiving 'skip' action timer applies config of next phase and stops running", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  -----s  1500ms             r',
        expected: '(xi)-(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: initialTestTimerConfig,
        },
        action: { s: 'start', r: 'skip' },
        expected: {
          x: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          i: { secondsLeft: 25 * 60, running: false, phaseIndex: 0 },
          a: { secondsLeft: 25 * 60, running: true, phaseIndex: 0 },
          b: { secondsLeft: 25 * 60 - 1, running: true, phaseIndex: 0 },
          c: { secondsLeft: 5 * 60, running: false, phaseIndex: 1 },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action,
        values.action
      ) as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$, initialTestTimerConfig);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });
});
