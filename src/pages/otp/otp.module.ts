import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpPage } from './otp';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OtpPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(OtpPage),
  ],
})
export class OtpPageModule {}
