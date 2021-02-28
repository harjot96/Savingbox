import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform,LoadingController , Events} from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { ProfileDetailsPage } from '../profile-details/profile-details';
import { HomePage } from '../home/home';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Api } from '../../providers';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ComponentProvider } from "../../providers/component/component";
import { GooglePlus } from '@ionic-native/google-plus';
import { OtpPage } from "../otp/otp";
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { PaymentMethodPage } from '../payment-method/payment-method';
import { OneSignal } from '@ionic-native/onesignal';
/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  loading: any;
  showsocialLogin=false;
  device_type: any = 'android';
  token: any = JSON.parse(localStorage.getItem('device_token'));
  public signinForm: FormGroup;
  constructor(public onesignla:OneSignal,public platform:Platform,private push: Push,public events:Events,private googlePlus: GooglePlus,public loadingController:LoadingController,public formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams,public Api:Api,private fb: Facebook,public componentProvider:ComponentProvider) {
this.platform.ready().then(()=>{
  this.onesignla.startInit('6ddfc1a1-64e8-4f3b-aa54-70fe36a43e8e', '240353357660');
  this.onesignla.getIds().then((res)=>{
    localStorage.setItem('player_id',res.userId)
  })
})
    
    this.signinForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      password: ["", Validators.compose([Validators.required])]
    });
    this.Api.http.get('http://thesavingsbox.com/api/show_social.php').subscribe((Res:any)=>{
      this.showsocialLogin=Res.data.showsocial;
      
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
    const options: PushOptions = {
      android: {
        senderID: '610384861171'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      localStorage.setItem('device_token',JSON.stringify(data.registrationId));
      this.token = JSON.parse(localStorage.getItem('device_token'));
      //TODO - send device token to server
    });

  }

  gotoSignup() {
    this.navCtrl.setRoot(SignupPage)
  }

  gotoProfile() {
    this.navCtrl.setRoot(ProfileDetailsPage);
  }
  // checkbrowser() {
  //   console.log( this.platform)
  //   if (this.platform.is('mobileweb') || this.platform.is('desktop')) {
  //     console.log("iff");
  //     this.token = 'ss';
  //     this.gotoTabs();
  //   } else {
  //     console.log("else");
  //     this.fcm.getToken().then(token => {
  //       this.token = token;
  //       if (this.platform.is('ios')) {
  //         this.device_type = 'ios';
  //       }
  //       this.gotoTabs();
  //     });
  //   }
  // }
  gotoTabs() {
         if (this.platform.is('ios')) {
          this.device_type = 'ios';
        }
    this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
    this.loading.present();
    let fd=new FormData();
    debugger
    fd.append('device_token', this.token),
    fd.append('device_type',this.device_type),
    fd.append('email',this.signinForm.value.email),
    fd.append('password',this.signinForm.value.password),
    fd.append('player_id',localStorage.getItem('player_id'))
    this.Api.post('login_test.php',fd).subscribe((res:any)=>{
    console.log(res);
    this.loading.dismiss();
    this.componentProvider.presentToast(res.message)
    if(res.status=='Success'){
      if(res.data.otp_status == "0"){
        localStorage.setItem('registeredData',JSON.stringify(res.data));
        this.navCtrl.setRoot(OtpPage);  
         
      }else{
        if(res.data.payment_status === "0"){
        // if(res.data.profile_status == "0"){

          localStorage.setItem('registeredData',JSON.stringify(res.data));
          this.navCtrl.setRoot(PaymentMethodPage, {profileStatus:res.data.profile_status} )
        }else{
          if(res.data.profile_status == "0"){
            localStorage.setItem('registeredData',JSON.stringify(res.data));
            this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus:res.data.profile_status} )
            }else{
            this.signinForm.reset();
            localStorage.setItem('userData', JSON.stringify(res.data));
            this.events.publish('user:created', Date.now());
            this.navCtrl.setRoot(TabsPage); 
          }
          
        }
      }
      // this.signinForm.reset();
      // localStorage.setItem('userData', JSON.stringify(res.data));
      // this.events.publish('user:created', Date.now());
      // this.navCtrl.setRoot(TabsPage);     

    }else{

    }


    },err=>{
      this.loading.dismiss();
     
    })
 
  }
  fblogin(){
       
  }
  forgetPassword(){
    this.navCtrl.push(ForgetPasswordPage)
  }
  doFbLogin(){
    this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
    this.loading.present();
		let permissions = new Array<string>();
     permissions = ["public_profile", "email"];
		this.fb.login(permissions)
		.then((response: FacebookLoginResponse) =>{
			let userId = response.authResponse.userID;
			this.fb.api("/me?fields=name,email", permissions)
			.then(user =>{
				user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        console.log('user', user);
        this.loading.dismiss();
        this.fbLogin(user);
        // localStorage.setItem('userData', JSON.stringify(user));
        // this.componentProvider.presentToast('User LoggedIn Successfully');
		}, error =>{
      console.log('error', error.errorMessage);
      this.loading.dismiss();
      this.componentProvider.presentToast(error.errorMessage);
		});
  }, error =>{
    this.loading.dismiss();
  });
}
checkFblogin() {
  this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
  this.loading.present();
    this.fb.getLoginStatus()
      .then(res => {
        console.log(res, "fb res");
        this.loading.dismiss();
        if (res.status === "connected") {
          let permissions = new Array<string>();
          permissions = ["public_profile", "email"];
          let userId = res.authResponse.userID;
          this.fb.api("/me?fields=name,email", permissions)
             .then(user => {
              user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
              console.log('user', user);
              this.fbLogin(user);
              // this.check_fbuser_exist(user);
            })
        } else {
          this.doFbLogin();
        }
      })
      .catch(e => {console.log(e)
        this.loading.dismiss();
      });
}
fbLogin(user){
  // this.fcm.getToken().then(token => {
  //   this.token = token;
    if (this.platform.is('ios')) {
      this.device_type = 'ios';
    } 
  this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
  this.loading.present();
  console.log(user, "user")
  let fd=new FormData();
  fd.append('facebook_id',user.id),
  fd.append('email',user.email),
  fd.append('name',user.name),
  fd.append('profile_image',user.picture),
  fd.append('device_token', this.token),
  fd.append('device_type',this.device_type),
  this.Api.post('fblogin.php',fd).subscribe((res:any)=>{
  console.log(res);
  this.loading.dismiss();
  this.componentProvider.presentToast(res.message)
  if(res.status=='Success'){
    // this.signinForm.reset();
    // localStorage.setItem('userData', JSON.stringify(res.data));
    // this.events.publish('user:created', Date.now());
    if(res.data.profile_status == "0"){
      localStorage.setItem('registeredData',JSON.stringify(res.data));
      this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus:res.data.profile_status} )
    }else{
      // this.signinForm.reset();
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.events.publish('user:created', Date.now());
      this.navCtrl.setRoot(TabsPage);   
    }
    // this.navCtrl.setRoot(TabsPage);     
  }else{
  }
}, err=>{
  this.loading.dismiss(); 
})
// });
}
async doGoogleLogin(){
  this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
  this.loading.present();
  this.googlePlus.login({
    // 'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
    'webClientId': '240353357660-ssnopf95b91cru2qkslcod43brf8r2sb.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
    'offline': true // Optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
  })
  .then(user =>{ 
    this.googleLogin(user);
   }, err =>{
    console.log(err, "eerr");
    alert(err)
    this.loading.dismiss();
  });  
 }
 googleLogin(user){
  // this.fcm.getToken().then(token => {
  //   this.token = token;
    if (this.platform.is('ios')) {
      this.device_type = 'ios';
    } 
  console.log(user, "user")
  let fd=new FormData();
  fd.append('gmail_id',user.userId),
  fd.append('email',user.email),
  fd.append('name',user.displayName),
  fd.append('profile_image',user.imageUrl),
  fd.append('device_token', this.token),
  fd.append('device_type',this.device_type),
  this.Api.post('gmaillogin.php',fd).subscribe((res:any)=>{
  console.log(res);
  this.loading.dismiss();
  this.componentProvider.presentToast(res.message)
  if(res.status=='Success'){
    // this.signinForm.reset();
    // localStorage.setItem('userData', JSON.stringify(res.data));
    // this.events.publish('user:created', Date.now());
    // this.navCtrl.setRoot(TabsPage);   
    if(res.data.profile_status == "0"){
      localStorage.setItem('registeredData',JSON.stringify(res.data));
      this.navCtrl.setRoot(ProfileDetailsPage, {profileStatus:res.data.profile_status} )
    }else{
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.events.publish('user:created', Date.now());
      this.navCtrl.setRoot(TabsPage);   
    }  
  }else{
  }
}, err=>{

// })
  })
}
}
