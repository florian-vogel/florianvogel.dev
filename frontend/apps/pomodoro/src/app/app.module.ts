import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PomodoroFeatureMainpageModule } from '@florianvogel-dev/pomodoro/feature-mainpage';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PomodoroFeatureMainpageModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
