import { SigninPage } from "./../signin/signin";
import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { IonicPage, NavController, ToastController,LoadingController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User, Api } from "../../providers";
import { CreateProfilePage } from "../create-profile/create-profile";
import { ComponentProvider } from "../../providers/component/component";
import { OtpPage } from "../otp/otp";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html",
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string; email: string; password: string } = {
    name: "Test Human",
    email: "test@example.com",
    password: "test",
  };

  // Our translated text strings
  private signupErrorString: string;
  public signupForm: FormGroup;
  passwordCheck: boolean = false;
  loading:any;
  constructor(
    public api:Api,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public componentProvider:ComponentProvider,
    public loadingController:LoadingController
  ) {
    this.signupForm = this.formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      email: ["",Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ]),
      ],
      password: ["", Validators.compose([Validators.required])],
      confirmpassword: ["", Validators.compose([Validators.required])],
      // gender:  ['', Validators.compose([Validators.required])],
    });
    this.translateService.get("SIGNUP_ERROR").subscribe((value) => {
      this.signupErrorString = value;
    });
  }

  doSignup() {
    let data={
      name:this.signupForm.value.name,
      email:this.signupForm.value.email,
      password:this.signupForm.value.password,
      confirm_password:this.signupForm.value.confirmpassword
    }
    this.api.post('register.php',data).subscribe((res)=>{
      console.log(res);
      
    })
    // // Attempt to login in through our User service
    // this.user.signup(this.account).subscribe(
    //   (resp) => {
    //     this.navCtrl.push(MainPage);
    //   },
    //   (err) => {
    //     this.navCtrl.push(MainPage);
    //     // Unable to sign up
    //     let toast = this.toastCtrl.create({
    //       message: this.signupErrorString,
    //       duration: 3000,
    //       position: "top",
    //     });
    //     toast.present();
    //   }
    // );
    
  }
  vrifyConfirmpassword() {
    if (this.signupForm.value.confirmpassword != "") {
      console.log(
        this.signupForm.value.password,
        this.signupForm.value.confirmpassword
      );
      if (
        this.signupForm.value.password == this.signupForm.value.confirmpassword
      ) {
        this.passwordCheck = false;
      } else {
        this.passwordCheck = true;
      }
    }
  }
  signup() {
    this.loading = this.loadingController.create({ content: "Please wait.." });
    this.loading.present();
    let fd=new FormData();
    fd.append('name',this.signupForm.controls.name.value)
    fd.append('email',this.signupForm.controls.email.value)
    fd.append('password',this.signupForm.controls.password.value)
    fd.append('confirm_password',this.signupForm.controls.confirmpassword.value)
    this.api.post('signup.php',fd).subscribe((res:any)=>{
      // debugger
      this.loading.dismiss();
      if(res.status =='Success'){
        this.componentProvider.presentToast(res.message)
        this.signupForm.reset();
        localStorage.setItem('registeredData',JSON.stringify(res.data));
        this.navCtrl.setRoot(OtpPage);
      }else{
        this.componentProvider.presentToast(res.message)
       }
      
    }, err=>{
      this.loading.dismiss();
    })
  };
  gotoSignin() {
    this.navCtrl.setRoot(SigninPage);
  }

  gotoCreateProfile() {
    this.navCtrl.setRoot(CreateProfilePage);
  }
}
