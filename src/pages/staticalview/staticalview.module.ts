import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StaticalviewPage } from './staticalview';
import { NgxGaugeModule } from 'ngx-gauge';
import {ProgressBarModule} from "angular-progress-bar"
@NgModule({
  declarations: [
    StaticalviewPage,
  ],
  imports: [
    NgxGaugeModule,
    ProgressBarModule,
    IonicPageModule.forChild(StaticalviewPage),
  ],
})
export class StaticalviewPageModule {}
