import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, App } from 'ionic-angular';
import { Api } from '../../providers';
import { ChatPage } from  '../chat/chat';
import { AddRoomPage } from  '../add-room/add-room';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  id:any='';
  data:any='';
  loading:any='';
  userData:any='';
  newdata = { nickname:"" };
  constructor(public api :Api,public navCtrl: NavController, public navParams: NavParams, public loadingController:LoadingController,public app:App) {
    this.id = navParams.get('id');
    this.getData();
    this.userData =JSON.parse(localStorage.getItem('userData'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
 
    getData(){
      this.loading = this.loadingController.create({ content: "Please wait..." });
      this.loading.present();
      let fd = new FormData();
      fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
      fd.append('user_id',this.id);
      this.api.post('user_profile.php', fd).subscribe((res: any) => {
        this.loading.dismiss();
        if (res.status == 'Success') {
          this.data = res['data'];  
          console.log(this.data); 
        } else {
          this.data ='';
        }
      },err=>{
        this.loading.dismiss();
      })
    }
    goTo(){
      this.app.getRootNav().push(AddRoomPage, {'friendid': this.data.user_id,'name':this.data.name,'image':this.data.profile_image});
        // this.navCtrl.setRoot(AddRoomPage, {'friendid': this.data.user_id, 'image':this.data.profile_image});
    }
  
}
