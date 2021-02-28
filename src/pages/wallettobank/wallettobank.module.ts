import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrencyMaskModule } from 'ngx-currency-mask';
import { WallettobankPage } from './wallettobank';

@NgModule({
  declarations: [
    WallettobankPage,
  ],
  
  imports: [
    IonicPageModule.forChild(WallettobankPage),
    CurrencyMaskModule,

  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class WallettobankPageModule {}
