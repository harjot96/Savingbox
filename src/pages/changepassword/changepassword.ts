import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Api } from '../../providers';
import { ComponentProvider } from '../../providers/component/component';

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  changeppassword: FormGroup;
  passwordCheck: boolean = false;
  loading:any;
  userData: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,public componentProvider:ComponentProvider,
    public loadingController:LoadingController,public api:Api) {
    this.userData = JSON.parse(localStorage.getItem("userData"));
    this.changeppassword = this.formBuilder.group({
      oldpassword: [ "",Validators.compose([ Validators.required,])],
      password:[ "",Validators.compose([ Validators.required,])],
      confirmpassword:[ "",Validators.compose([ Validators.required,])],

    });

  }
  vrifyConfirmpassword() {
    if (this.changeppassword.value.confirmpassword != "") {
      console.log(
        this.changeppassword.value.password,
        this.changeppassword.value.confirmpassword
      );
      if (
        this.changeppassword.value.password == this.changeppassword.value.confirmpassword
      ) {
        this.passwordCheck = false;
      } else {
        this.passwordCheck = true;
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }
  change_password(){
    this.loading = this.loadingController.create({ content: "Please wait.." });
    this.loading.present();
    let fd=new FormData();
    fd.append('user_token',this.userData.token)
    fd.append('old_password',this.changeppassword.value.oldpassword)  
    fd.append('new_password',this.changeppassword.value.password)  
    this.api.post('change_password.php',fd).subscribe((res:any) =>{
      this.loading.dismiss();
      if(res.status =='Success'){
        this.componentProvider.presentToast(res.message)
        this.changeppassword.reset();
      }else{
        this.componentProvider.presentToast(res.message)
       }
      
    }, err=>{
      this.loading.dismiss();
      
    })
  }

}
