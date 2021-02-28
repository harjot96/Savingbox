import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../providers';
import { ComponentProvider } from "../../providers/component/component";
import { SigninPage } from "./../signin/signin";
import { ProfileDetailsPage } from '../profile-details/profile-details';
import { PaymentMethodPage } from '../payment-method/payment-method';
/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
})
export class OtpPage {
  otpform: FormGroup;
  loading: any;
  device_type: any = 'android';
  token: any = JSON.parse(localStorage.getItem('device_token'));
  registeredData:any='';

  constructor(public platform:Platform,public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public Api: Api, public loadingController: LoadingController, public componentProvider
    : ComponentProvider) {
    this.otpform = this.formBuilder.group({
      otp: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OTP');
    this.registeredData = JSON.parse(localStorage.getItem('registeredData'));
  }
  // checkbrowser() {
  //   if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
  //     console.log("iff");
  //     this.token = 'ss';
  //     this.save();
  //   } else {
  //     console.log("else");
  //     this.fcm.getToken().then(token => {
  //       this.token = token;
  //       if (this.platform.is('ios')) {
  //         this.device_type = 'ios';
  //       }
  //       this.save();
  //     });
  //   }
  // }
  save() {
    if (this.platform.is('ios')) {
          this.device_type = 'ios';
        }
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    fd.append('otp', this.otpform.controls.otp.value),
    fd.append('user_token', this.registeredData.token),
    fd.append('device_token', this.token),
    fd.append('device_type',this.device_type),
    this.Api.post('otp_verify.php', fd).subscribe((res) => {
      console.log(res);
      this.loading.dismiss();
      this.componentProvider.presentToast(res['message'])
      if (res['status'] == 'Success') {
        if(this.registeredData.profile_status == 0){
          
          // this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus: this.registeredData.profile_status} )
          this.navCtrl.setRoot(PaymentMethodPage, {profileStatus: this.registeredData.profile_status, status:'signup'} )
          localStorage.setItem('paymentover','signup')
          }else{
          // this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus: this.registeredData.profile_status})
          this.navCtrl.setRoot(PaymentMethodPage, {profileStatus: this.registeredData.profile_status})

          }
     
        // this.otpform.reset();
        // this.navCtrl.setRoot(SigninPage)
      } else {

      }
    })
  }
  goTo() {
    this.navCtrl.setRoot(SigninPage)
  }
  resendotp(){
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    // fd.append('otp', this.otpform.controls.otp.value)
    fd.append('user_token', this.registeredData.token)
    this.Api.post('resend_otp.php', fd).subscribe((res) => {
      console.log(res);
      this.loading.dismiss();
      this.componentProvider.presentToast(res['message'])
      if (res['status'] == 'Success') {
     
        // this.otpform.reset();
        // this.navCtrl.setRoot(SigninPage)
      } else {

      }
    })
  }
}
