import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SigninPage } from './signin';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SigninPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(SigninPage),
  ],
})
export class SigninPageModule {}
