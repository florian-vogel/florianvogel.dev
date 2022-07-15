import { Component, OnInit } from '@angular/core';

const dummyTodos: Todo[] = [
  {
    title: 'do homework',
    duration: 1,
  },
  {
    title: 'code',
    duration: 3,
  },
];

interface Todo {
  title: string;
  duration: number;
}

@Component({
  selector: 'pomodoro-mainpage-todos-view',
  templateUrl: './todos-view.component.html',
  styleUrls: ['./todos-view.component.scss'],
})
export class TodosViewComponent {
  constructor() {}
}
