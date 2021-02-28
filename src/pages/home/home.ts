import { MemberDetailsPage } from './../member-details/member-details';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events,LoadingController, AlertController } from 'ionic-angular';
import { MyProfilePage } from "../my-profile/my-profile";
import { Api } from '../../providers';
import { StaticalviewPage } from '../staticalview/staticalview';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  userData:any='';
  loading:any='';
  alertshow=true;
  cycleData:any=[];
  segmentVal:any='0'
  ongoingcycleData:any=[];
  completedcycleData:any=[];
  noData:boolean=false;
  constructor(public alert:AlertController, public api:Api,public events:Events,public navCtrl: NavController, public navParams: NavParams, public loadingController:LoadingController) {
    // this.userData =JSON.parse(localStorage.getItem('userData'));
   console.log('home');
   
    this.events.subscribe("user:created", (data: any) => {
      this.userProfile();    
    });

    
    // this.events.subscribe("cycle:created", (data: any) => {
    //   this.userProfile();
    //   this.ongoingcycleData=[];
    //   this.completedcycleData=[];
    //   this.noData=false;
    //   this.getCycle();
    //   console.log("enter into cycle ")
    // });
  }
  goTo(){
    this.navCtrl.push(MyProfilePage)
  }
  show()
  {
     if(this.ongoingcycleData.length ===0)
    {
      let alert=this.alert.create({
        message:'Tap the ➕ button to create a New Box',
        mode:'ios',
        buttons:[{
          text:'Ok',
          role:'Close'
        }]
      })
      alert.present();
      
    }
  }
  ionViewDidEnter() {
    this.ongoingcycleData=[];
    this.completedcycleData=[];
    
    this.noData=false;
    this.userProfile();
    this.getCycle();


  }

//   segmentChange(evn){
//     console.log(evn.target)
//      this.getCycle();
//  }
  userProfile(){
    // this.userData =JSON.parse(localStorage.getItem('userData'));
    let fd=new FormData();
    fd.append('user_token',JSON.parse(localStorage.getItem('userData')).token),
   this.api.post('view_profile.php',fd).subscribe((res:any)=>{
    console.log(res);
    if(res.status=='Success'){
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.userData = JSON.parse(localStorage.getItem('userData'));
      console.log(this.userData.profile_image)
    }else{

    }
    },err=>{
      })
  }
  openGroup(value) {
    console.log(value)
    this.navCtrl.push(MemberDetailsPage, {data: JSON.stringify(value)})
  }
  getCycle(){
    console.log(JSON.parse(localStorage.getItem('userData')).token);
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    this.api.post('cycle_list.php', fd).subscribe((res: any) => {
      console.log(res);
      this.noData = true;
      this.loading.dismiss();
      if (res.status == 'Success') {
        this.cycleData = res['data'];
        this.cycleData.forEach(element => {
          if(element.cycle_status == "0"){
            this.ongoingcycleData.push(element)
          }
          else{
            this.completedcycleData.push(element)
          }
        });
      } else {
        this.show();
        this.cycleData = [];
      }
    }, err => {
      this.loading.dismiss();
    });
  }

  // open() {
  //   this.navCtrl.push(StaticalviewPage);
  // }

}
