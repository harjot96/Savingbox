import { ProfileDetailsPage } from './../profile-details/profile-details';
import { ChangepasswordPage } from './../changepassword/changepassword';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, PopoverController, AlertController } from 'ionic-angular';
import { PaymentMethodPage } from '../payment-method/payment-method';
import { SigninPage } from '../signin/signin';
import { Api } from '../../providers';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ComponentProvider } from "../../providers/component/component";
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import * as moment from 'moment';

/**
 * Generated class for the MyProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  userData: any = '';
  imageUpload: any = '';
  profile_pic :any='';
  emailStatus:boolean =false;
  mobileStatus:boolean =false;
  dobStatus:boolean =false;
  genderStatus:boolean =false;

  constructor(public pop:AlertController, public fb :Facebook,public camera: Camera,public events: Events, public api: Api, public navCtrl: NavController, public navParams: NavParams, public componentProvider: ComponentProvider, public app: App) {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    if(this.userData.profile_image != null && this.userData.profile_image){
      this.profile_pic = this.userData.profile_image;
      console.log(this.profile_pic)
    }else{
      this.profile_pic ='';
    }  
    this.events.subscribe("user:created", (data: any) => {
      this.userData = JSON.parse(localStorage.getItem('userData'));
      this.userProfile();
    });
  }
  userProfile() {
    console.log(JSON.parse(localStorage.getItem('userData')).token)
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token),
      this.api.post('view_profile.php', fd).subscribe((res: any) => {
        console.log(res);
        if (res.status == 'Success') {
          localStorage.setItem('userData', JSON.stringify(res.data));
          this.userData = res.data;
          if(this.userData.profile_image != null && this.userData.profile_image){
            this.profile_pic = this.userData.profile_image;
            console.log(this.profile_pic)
          }else{
            this.profile_pic ='';
          }     
            if(this.userData.date_of_birth_status =="1"){
              this.dobStatus =true;
            }
            if(this.userData.email_status =="1"){
              this.emailStatus =true;
            }
            if(this.userData.gender_status =="1"){
              this.genderStatus =true;
            }
            if(this.userData.mobile_status =="1"){
              this.mobileStatus =true;
            }
           console.log( this.userData, "userdata")
        } else {

        }
      }, err => {
      })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyProfilePage');
  }


  Suport()
  {
let pop=this.pop.create({title:'Contact us at',
  message:'help@thesavingsbox.com',
  buttons:[{
    text:'Ok',
    role:'cancel'
  }],
  mode:'ios'
})
pop.present();
  }
  ngOnInit(){
    this.userProfile();
  }
  gotoChangePassword() {
    this.navCtrl.setRoot(ChangepasswordPage);
  }

  gotoPaymentMethod() {
    this.navCtrl.setRoot(PaymentMethodPage);
  }

  gotoEditProfile() {
    this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus:"1"} )
  }
  logout() {
    // this.fb.logout()
    // .then( res =>{
    //   localStorage.clear();
    //   this.componentProvider.presentToast("Logout Successfully");
    //   this.app.getRootNav().setRoot(SigninPage);
    // })
    // .catch(e => console.log('Error logout from Facebook', e));
    localStorage.clear();
    this.componentProvider.presentToast("User logout Successful");
    this.app.getRootNav().setRoot(SigninPage);
    // this.navCtrl.setRoot(SigninPage)

  }
  updateStatus(type, status) {
    var newstatus;
    if(!status){
      newstatus = 0
    }else{
      newstatus =1
    }
    console.log(JSON.parse(localStorage.getItem('userData')).token)
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token),
    fd.append('update_type', type),
    fd.append('status', newstatus),
      this.api.post('update_profile_button.php', fd).subscribe((res: any) => {
        console.log(res)
        if(res.status == 'Success'){
         this.events.publish('user:created', Date.now());
        }
      })
    }

    gotoPrivacyPolicy()
    {
      this.navCtrl.push(PrivacyPolicyPage)
    }

    getDateofbirth(val)
    {
  return moment(val).format('MM-DD-YYYY');
   
    }
}
