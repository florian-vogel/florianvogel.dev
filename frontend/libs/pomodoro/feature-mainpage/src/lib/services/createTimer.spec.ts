import { TestScheduler } from 'rxjs/testing';
import { createTimer, TimerAction, TimerConfig } from './createTimer';
import { Observable } from 'rxjs';

type TestTimerPhase = 'work' | 'break' | 'longBreak';

function nextTestTimerPhase(phase: TestTimerPhase): TestTimerPhase {
  return phase === 'work' ? 'break' : phase === 'break' ? 'longBreak' : 'work';
}

const initialTestTimerConfig: TimerConfig<TestTimerPhase> = {
  startPhase: 'work',
  phaseDurations: {
    work: 25 * 60,
    break: 5 * 60,
    longBreak: 15 * 60,
  },
  nextPhase: nextTestTimerPhase,
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
          i: {
            startPhase: 'work' as TestTimerPhase,
            phaseDurations: { work: 60, break: 5, longBreak: 20 },
            nextPhase: nextTestTimerPhase,
          },
          j: {
            startPhase: 'break' as TestTimerPhase,
            phaseDurations: { work: 120, break: 5, longBreak: 25 },
            nextPhase: nextTestTimerPhase,
          },
        },
        expected: {
          x: { secondsLeft: 25 * 60, phase: 'work', running: false },
          i: { secondsLeft: 60, running: false, phase: 'work' },
          j: { secondsLeft: 5, running: false, phase: 'break' },
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

  it("timer starts countdown when receiving 'start' action", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  -------s',
        expected: '(xi)---(a 997ms ) (b 997ms ) (c 997ms ) d',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as TestTimerPhase,
            phaseDurations: { work: 3, break: 1, longBreak: 1 },
            nextPhase: nextTestTimerPhase,
          },
        },
        action: { s: 'start' },
        expected: {
          x: { secondsLeft: 25 * 60, phase: 'work', running: false },
          i: { secondsLeft: 3, phase: 'work', running: false },
          a: { secondsLeft: 3, phase: 'work', running: true },
          b: { secondsLeft: 2, phase: 'work', running: true },
          c: { secondsLeft: 1, phase: 'work', running: true },
          d: { secondsLeft: 1, phase: 'break', running: false },
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

  it("timer pauses when receiving 'pause' action and continues where left of with following 'start' action", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  ------s  1500ms             p 200ms s',
        expected: '(xi)--(a 997ms ) (b 498ms ) c 200ms (d 997ms ) e',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as TestTimerPhase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
            nextPhase: nextTestTimerPhase,
          },
        },
        action: { s: 'start', p: 'pause' },
        expected: {
          x: { secondsLeft: 25 * 60, phase: 'work', running: false },
          i: { secondsLeft: 2, phase: 'work', running: false },
          a: { secondsLeft: 2, phase: 'work', running: true },
          b: { secondsLeft: 1, phase: 'work', running: true },
          c: { secondsLeft: 1, phase: 'work', running: false },
          d: { secondsLeft: 1, phase: 'work', running: true },
          e: { secondsLeft: 1, phase: 'break', running: false },
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

  it("timer resets to latest config when receiving 'reset' action ", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  ------s  1500ms              r',
        expected: '(xi)--(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as TestTimerPhase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
            nextPhase: nextTestTimerPhase,
          },
        },
        action: { s: 'start', r: 'reset' },
        expected: {
          x: { secondsLeft: 25 * 60, phase: 'work', running: false },
          i: { secondsLeft: 2, phase: 'work', running: false },
          a: { secondsLeft: 2, phase: 'work', running: true },
          b: { secondsLeft: 1, phase: 'work', running: true },
          c: { secondsLeft: 2, phase: 'work', running: false },
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

  it("timer skips to next phase when receiving 'skip' action ", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  -----s  1500ms             r',
        expected: '(xi)-(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as TestTimerPhase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
            nextPhase: nextTestTimerPhase,
          },
        },
        action: { s: 'start', r: 'skip' },
        expected: {
          x: { secondsLeft: 25 * 60, phase: 'work', running: false },
          i: { secondsLeft: 2, phase: 'work', running: false },
          a: { secondsLeft: 2, phase: 'work', running: true },
          b: { secondsLeft: 1, phase: 'work', running: true },
          c: { secondsLeft: 1, phase: 'break', running: false },
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
