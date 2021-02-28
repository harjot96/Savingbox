import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicPageModule } from 'ionic-angular';
import { SuggestedFriendsPage } from './suggested-friends';

@NgModule({
  declarations: [
    SuggestedFriendsPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(SuggestedFriendsPage),
  ],
})
export class SuggestedFriendsPageModule {}
