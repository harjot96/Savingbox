import { NewCyclePage } from './../new-cycle/new-cycle';
import { ChatPage } from './../chat/chat';
import { NotificationsPage } from './../notifications/notifications';
import { MyProfilePage } from './../my-profile/my-profile';
import { HomePage } from './../home/home';
import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController,Events,Tabs } from 'ionic-angular';
import { Api } from '../../providers';
import { Tab2Root, Tab3Root } from '../';
import { ChatroomPage } from '../chatroom/chatroom';
import { WalletpagePage } from '../walletpage/walletpage';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('paymentTabs') paymentTabs: Tabs;
  home: any = HomePage;
  noti: any = NotificationsPage;
  add: any = NewCyclePage;
  chat: any = ChatroomPage;
  profile: any = MyProfilePage;
  wallet:any= WalletpagePage;
  userData:any='';
  userId:any='';
  constructor(public api:Api,public navCtrl: NavController, public events:Events) {
    this.userData =JSON.parse(localStorage.getItem('userData'));
      // this.paymentTabs.select(0);
    // this.userId =JSON.parse(localStorage.getItem('userData')).id;
    this.events.subscribe("user:created", (data: any) => {
     this.userProfile();
    });
  }
  


    ionViewDidLoad() {
      // this.paymentTabs.select(0);
        // this.tabRef.select(1, { animate: false });
    }
  userProfile(){
    this.userData =JSON.parse(localStorage.getItem('userData'));
    let fd=new FormData();
    fd.append('user_token',this.userData.token),
   this.api.post('view_profile.php',fd).subscribe((res:any)=>{
    console.log(res);
    if(res.status=='Success'){
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.userData = JSON.parse(localStorage.getItem('userData'));
    }else{

    }
    },err=>{
      })
  }
  goTo(){
      this.navCtrl.setRoot(NotificationsPage);
  }
}
