import { Component } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
// import { Stripe } from '@ionic-native/stripe';
import { Form, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers';
import { ComponentProvider } from '../../providers/component/component';
declare var Stripe: any;

/**
 * Generated class for the PagesAddbankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-addbank',
  templateUrl: 'pages-addbank.html',
})
export class PagesAddbankPage {
  addaccount: FormGroup;
  // stripe: any;
  // stripe = Stripe('pk_test_51H87fOAzrKeV9fX3ulb0pAEfDF1Qcq1bD397x7cgoSxRIbP5ijAi2sw6oKoL9oO2ERMBU3E4iRPVHWFRffnWEIwD00BktKafCb');
  // pk_test_51H87fOAzrKeV9fX3ulb0pAEfDF1Qcq1bD397x7cgoSxRIbP5ijAi2sw6oKoL9oO2ERMBU3E4iRPVHWFRffnWEIwD00BktKafCb
  // const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public comp: ComponentProvider) {
    this.addAccount();
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesAddbankPage');
    this.createToken();
  }
  async createToken(){
    // const token = await this.stripe.tokens.create({
    //   bank_account: {
    //     country: 'US',
    //     currency: 'usd',
    //     account_holder_name: 'Jenny Rosen',
    //     account_holder_type: 'individual',
    //     routing_number: '110000000',
    //     account_number: '000123456789',
    //   },
    // });
    // console.log(token, "yoken")
  }

  addAccount(): void {
    this.addaccount = new FormGroup({
      name: new FormControl('', Validators.required),
      account_no: new FormControl('', Validators.required),
      routing_no: new FormControl('', Validators.required)
    })
  }

  SaveAccount() {
    debugger
    if (this.addaccount.valid) {
      let fd = new FormData();
      fd.append('account_name', this.addaccount.controls.name.value),
        fd.append('account_no', this.addaccount.controls.account_no.value),
        fd.append('routing_no', this.addaccount.controls.routing_no.value),
        fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token),
        this.api.post('add_bank_account.php', fd).subscribe((res: any) => {
          console.log(res);
          this.comp.presentToast(res.message);
          this.navCtrl.pop();
        })
    }
    else {
      this.comp.presentToast('All fileds are requried')

    }
  }

}
