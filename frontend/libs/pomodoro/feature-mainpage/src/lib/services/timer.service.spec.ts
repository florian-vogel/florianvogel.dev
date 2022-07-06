/* import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import {
  createIntervalTimer,
  IntervalTimerAction,
  Phase,
} from './timer.service';

describe('timerService', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  // Test cases are similar to createTimer
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
      ) as unknown as Observable<IntervalTimerAction>;
      const timer$ = createIntervalTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  });

  it("timer starts counting backwards when receiving 'start' action", () => {
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
            startPhase: 'break' as Phase,
            phaseDurations: { work: 60, break: 3, longBreak: 20 },
          },
        },
        action: { s: 'start' },
        expected: {
          i: { secondsLeft: 3, running: false, phase: 'break' },
          a: { secondsLeft: 3, running: true, phase: 'break' },
          b: { secondsLeft: 2, running: true, phase: 'break' },
          c: { secondsLeft: 1, running: true, phase: 'break' },
          d: { secondsLeft: 60, running: false, phase: 'work' },
        },
      };

      const config$ = cold(marbles.config, values.config);
      const action$ = cold(
        marbles.action,
        values.action
      ) as Observable<IntervalTimerAction>;
      const timer$ = createIntervalTimer(config$, action$);

      expectObservable(timer$).toBe(marbles.expected, values.expected);
    });
  }); 
});
  */
/*
  it("timer pauses when receiving 'pause' action and continues where left of with following 'start' action", () => {
    testScheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;

      const marbles = {
        config: '  i',
        action: '  --s  1500ms             p 200ms s',
        expected: 'i-(a 997ms ) (b 498ms ) c 200ms (d 997ms ) e',
      };
      const values = {
        config: { i: { startTime: 2 } },
        action: { s: 'start', p: 'pause' },
        expected: {
          i: { secondsLeft: 2, running: false },
          a: { secondsLeft: 2, running: true },
          b: { secondsLeft: 1, running: true },
          c: { secondsLeft: 1, running: false },
          d: { secondsLeft: 1, running: true },
          e: { secondsLeft: 0, running: false },
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
        config: { i: { startTime: 2 } },
        action: { s: 'start', r: 'reset' },
        expected: {
          i: { secondsLeft: 2, running: false },
          a: { secondsLeft: 2, running: true },
          b: { secondsLeft: 1, running: true },
          c: { secondsLeft: 2, running: false },
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
  }); */
