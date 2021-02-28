import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../providers';
import { ComponentProvider } from "../../providers/component/component";
import { SigninPage } from "./../signin/signin";

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
forgetform:FormGroup;
loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public formBuilder:FormBuilder,public Api:Api,public loadingController:LoadingController, public componentProvider
    :ComponentProvider) {
    this.forgetform = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }
  forgetPassword(){
    
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
  let fd=new FormData();
  fd.append('email',this.forgetform.controls.email.value)
  this.Api.post('forgot_password.php',fd).subscribe((res)=>{
    console.log(res);
    this.loading.dismiss();
    this.componentProvider.presentToast(res['message'])
    if(res['status'] =='Success'){
      this.forgetform.reset();
      this.navCtrl.setRoot(SigninPage)
    }else{

    }
  })
  }
  goTo(){
    this.navCtrl.setRoot(SigninPage)
  }

}
