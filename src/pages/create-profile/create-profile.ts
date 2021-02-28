import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SuggestedFriendsPage } from '../suggested-friends/suggested-friends';

@IonicPage()
@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
})
export class CreateProfilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProfilePage');
  }

  gotoSuggestFriend() {
    this.navCtrl.setRoot(SuggestedFriendsPage);
  }

}
