import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletpagePage } from './walletpage';

@NgModule({
  declarations: [
    WalletpagePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletpagePage),
  ],
})
export class WalletpagePageModule {}
