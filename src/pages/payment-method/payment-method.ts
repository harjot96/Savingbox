import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';
import * as moment from 'moment';
import { Api } from '../../providers';
import { ProfileDetailsPage } from '../profile-details/profile-details';
import { SigninPage } from '../signin/signin';
declare var $: any;

/**
 * Generated class for the PaymentMethodPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethodPage {
  paymentForm: FormGroup
  userData: any;
  form: {
    paymentmethod: 'visa' | 'master' | 'paypal' | 'bank'
  } = {
      paymentmethod: 'visa'
    };
  card_type: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private stripe: Stripe, public alert: AlertController, public loader: LoadingController, public api: Api) {

    this.stripe.setPublishableKey('pk_live_51H87fOAzrKeV9fX38ofdYpS9BKIh8jk57Xeh5tpd0Ed6ByRxeTaUh8C50YTzDuo6dx96p4iULfu25TgFhsJwmHj2000U90O91P');
    this.paymentformInit();

  }
  Gotopaypal() {
    alert('!404 Error Paypal is under maintenance');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentMethodPage');
  }

  selectvalue(val, evn) {
    console.log(val, "value");
    $('.col-6 text-center mt-3').removeClass('active');
    $(evn).closest('div').addClass('active');
  }
  gotoHome() {
    let loader = this.loader.create({
      content: 'Please wait',
    })
    loader.present();
    let year = moment(this.paymentForm.controls.cardExp.value, "YYYY-MM").format("YYYY");
    let day = moment(this.paymentForm.controls.cardExp.value, "YYYY-MM").format("MM");

    let card = {
      number: this.paymentForm.controls.cardNum.value,
      expMonth: parseInt(day),
      expYear: parseInt(year),
      cvc: this.paymentForm.controls.cardCvv.value,
    };
    this.stripe.createCardToken(card)
      .then(token => {
        console.log(token);
        loader.dismiss();
        let fd = new FormData();
        if (localStorage.getItem('registeredData') != undefined) {
          fd.append('user_token', JSON.parse(localStorage.getItem('registeredData')).token)
        }
        else {
          fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token)

        }
        fd.append('card_token', token.id)
        fd.append('brand', token.card.brand),
          fd.append('exp_month', JSON.stringify(token.card.exp_month)),
          fd.append('exp_year', JSON.stringify(token.card.exp_year)),
          fd.append('last4', token.card.last4),


          this.api.post('add_card.php', fd).subscribe((res: any) => {
            let alert = this.alert.create({
              message: res.message,
              buttons: [{
                text: 'Ok',
                handler: () => {
                  debugger
                  if (this.navParams.get('profileStatus') === '0') {
                    this.navCtrl.setRoot(ProfileDetailsPage, { profileStatus: this.navParams.get('profileStatus') })
                  }
                  else {
                    if (localStorage.getItem('paymentover') === 'signup') {
                      this.navCtrl.setRoot(SigninPage);
                    }
                    else {
                      this.navCtrl.setRoot(TabsPage)
                    }
                  }


                }
              }]
            })
            alert.present();

          })
      })
      .catch(error => {
        loader.dismiss();
        let alert = this.alert.create({
          message: error,
          buttons: [{
            text: 'Ok',
            role: 'Close'
          }]
        })
        alert.present();
      }
      );

  }

  paymentformInit(): void {
    this.paymentForm = new FormGroup({
      name: new FormControl('', Validators.required),
      cardNum: new FormControl('', [Validators.required, Validators.maxLength(16)]),
      cardExp: new FormControl('', Validators.required),
      cardCvv: new FormControl('', Validators.required)
    })
  }




}
