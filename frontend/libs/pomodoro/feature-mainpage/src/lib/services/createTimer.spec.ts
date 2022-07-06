import { TestScheduler } from 'rxjs/testing';
import { createTimer, Phase, TimerAction } from './createTimer';
import { Observable } from 'rxjs';

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
        expected: 'i-j-',
        config: '  i-j-',
        action: '  ----',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as Phase,
            phaseDurations: { work: 60, break: 5, longBreak: 20 },
          },
          j: {
            startPhase: 'break' as Phase,
            phaseDurations: { work: 120, break: 5, longBreak: 25 },
          },
        },
        expected: {
          i: { secondsLeft: 60, running: false, phase: 'work' },
          j: { secondsLeft: 5, running: false, phase: 'break' },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action
      ) as unknown as Observable<TimerAction>;
      const timer$ = createTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("timer starts countdown when receiving 'start' action", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  --s',
        expected: 'i-(a 997ms ) (b 997ms ) (c 997ms ) d',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as Phase,
            phaseDurations: { work: 3, break: 1, longBreak: 1 },
          },
        },
        action: { s: 'start' },
        expected: {
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
      const timer$ = createTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("timer pauses when receiving 'pause' action and continues where left of with following 'start' action", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  --s  1500ms             p 200ms s',
        expected: 'i-(a 997ms ) (b 498ms ) c 200ms (d 997ms ) e',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as Phase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
          },
        },
        action: { s: 'start', p: 'pause' },
        expected: {
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
      const timer$ = createTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("timer resets to latest config when receiving 'reset' action ", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  --s  1500ms             r',
        expected: 'i-(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as Phase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
          },
        },
        action: { s: 'start', r: 'reset' },
        expected: {
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
      const timer$ = createTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("timer skips to next phase when receiving 'skip' action ", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  --s  1500ms             r',
        expected: 'i-(a 997ms ) (b 498ms ) c',
      };
      const values = {
        config: {
          i: {
            startPhase: 'work' as Phase,
            phaseDurations: { work: 2, break: 1, longBreak: 2 },
          },
        },
        action: { s: 'start', r: 'skip' },
        expected: {
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
      const timer$ = createTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });
});
