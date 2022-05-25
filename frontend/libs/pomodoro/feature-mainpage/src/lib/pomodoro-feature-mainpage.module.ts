import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainpageComponent } from './container/mainpage/mainpage.component';
import { TimerViewComponent } from './container/timer-view/timer-view.component';
import { NotesViewComponent } from './container/notes-view/notes-view.component';
import { TodosViewComponent } from './container/todos-view/todos-view.component';
import { SharedUiCommonModule } from '@florianvogel-dev/shared/ui-common';

@NgModule({
  imports: [CommonModule, SharedUiCommonModule],
  declarations: [
    MainpageComponent,
    TimerViewComponent,
    NotesViewComponent,
    TodosViewComponent,
  ],
  exports: [MainpageComponent],
})
export class PomodoroFeatureMainpageModule {}
