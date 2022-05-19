import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosViewComponent } from './todos-view.component';

describe('TodosViewComponent', () => {
  let component: TodosViewComponent;
  let fixture: ComponentFixture<TodosViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TodosViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
