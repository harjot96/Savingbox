import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events, LoadingController, AlertController, ToastController, PopoverController } from 'ionic-angular';
import { Api } from '../../providers';
import * as moment from 'moment';
import { SelectCardPage } from '../select-card/select-card';

// import {TimeAgoPipe} from 'time-ago-pipe';
/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
  userData:any='';
  loading:any;
  notidata:any=[];
  paymentList: any=[];
  constructor( public popover:PopoverController, public toast:ToastController, public api :Api,public loadingController:LoadingController,public events:Events,public alert:AlertController, public navCtrl: NavController, public navParams: NavParams) {
    // console.log(this.today_day);
    this.events.subscribe("notification:created", (data: any) => {
      this.userData = JSON.parse(localStorage.getItem('userData'));
      this.getData();
      this.getpayment();
    });
  }

  ionViewWillEnter() {
    
    console.log('ionViewDidLoad NotificationsPage');
    this.getData();
    this.getpayment();
  }

  getData(){
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    this.api.post('invitations.php', fd).subscribe((res: any) => {
      this.loading.dismiss();
      if (res.status == 'Success') {
        if(res['data'].length>0){
          res['data'].forEach((element,key) => {
            res['data'][key].time = moment(moment(element.created_at, 'YYYY-MM-DD HH:mm:ss')).format(); 
          });
        }
        this.notidata = res['data'];  
        console.log(this.notidata, "noti"); 
      } else {
        this.notidata = [];
      }
    },err=>{
      this.loading.dismiss();
    })
  }
  accept_reject(data,id){
    let loader= this.loadingController.create({
    content:'Please wait',
    enableBackdropDismiss:false,
    showBackdrop:false,
    })
loader.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('status', data);
    fd.append('invitation_id', id);

    this.api.post('invitation_status_change.php', fd).subscribe((res: any) => {
       if (res.status == 'Success') {
      this.events.publish('notification:created', Date.now());
      this.events.publish('cycle:created', Date.now());
loader.dismiss();
       
      } else {
loader.dismiss();
       
        this.notidata = [];
      }
    },err=>{
loader.dismiss();
    })

  }

  getpayment()
  {
   let fd =new FormData();
   fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    this.api.post('pending_payments.php', fd).subscribe((res: any) => {
     this.paymentList=res.data
     
   },err=>{
     })
  }

  payPayment(data)
  {
let alert=this.alert.create({
  message:data.message,
  mode:'ios',
  enableBackdropDismiss:false,
  title:data.title,
  buttons:[{
    text:'Yes',
    handler:()=>{
let popover=this.popover.create(SelectCardPage,{data:data},{cssClass: 'contact-popover'})
popover.present()
popover.onDidDismiss((res)=>{
  this.ionViewWillEnter();
})
//       let loader= this.loadingController.create({
//         content:'Making transaction please wait.',
//       })
//       loader.present();
//       let fd=new FormData();

//       fd.append('cycle_id',data.cycle_id)
// this.api.post('charge_customer.php',fd).subscribe((res:any)=>{
//   loader.dismiss();
//   console.log(res);
// let toast =  this.toast.create({
//     message:res.message,
//     duration:3000,
//     position:'bottom',
//   })
//   toast.present();
//   this.events.publish('pay:created', Date.now());
//   this.ionViewWillEnter();
  
// },(err:any)=>{
//   if(err)
//   {
//     loader.dismiss();
//   }
// })
    }
  },
{
  text:'No',
  role:'cancel'
}]
})
alert.present();

}
}
