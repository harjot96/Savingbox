import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicPageModule } from 'ionic-angular';
import { PagesAddbankPage } from './pages-addbank';

@NgModule({
  declarations: [
    PagesAddbankPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(PagesAddbankPage),
  ],
})
export class PagesAddbankPageModule {}
