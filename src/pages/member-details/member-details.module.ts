import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberDetailsPage } from './member-details';

@NgModule({
  declarations: [
    MemberDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberDetailsPage),
  ],
})
export class MemberDetailsPageModule {}
