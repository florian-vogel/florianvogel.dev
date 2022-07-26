import { Observable, Subject } from 'rxjs';

export function asObservable<T>(subject: Subject<T>) {
  return new Observable<T>((fn) => subject.subscribe(fn));
}
