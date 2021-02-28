import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupPage } from './signup';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(SignupPage),
    TranslateModule.forChild()
  ],
  exports: [
    SignupPage
  ]
})
export class SignupPageModule { }
