import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewCyclePage } from './new-cycle';
import { CurrencyMaskModule } from "ngx-currency-mask";
@NgModule({
  declarations: [
    NewCyclePage,
  ],
  imports: [
    IonicPageModule.forChild(NewCyclePage),
    CurrencyMaskModule
  ],
})
export class NewCyclePageModule {}
