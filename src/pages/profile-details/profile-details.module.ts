import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileDetailsPage } from './profile-details';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileDetailsPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(ProfileDetailsPage),
  ],
})
export class ProfileDetailsPageModule {}
