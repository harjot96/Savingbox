import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,Content,Events} from 'ionic-angular';
import { ProfilePage } from  '..//profile/profile';

import * as firebase from 'Firebase';
import * as moment from 'moment';
import 'firebase/firestore'
// import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the AddRoomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  @ViewChild('Content') content: Content
  data: any='';
  // User:any='';
  message:any='';
  message_ref:any;
  friend_uid2:any="";
  my_uid1:any='';
  // toUser:any;
  User: string = "Me";
  toUser: string = "HealthBot";
  msgList: any = [];
  my_profile:any='';
  image='';
  userData:any='';
  name:any='';
  ref = firebase.database().ref('chats/');
  constructor(public navCtrl: NavController, public navParams: NavParams,public events: Events) {
    this.friend_uid2 = this.navParams.get('friendid'); 
    this.name = this.navParams.get('name'); 

    this.image = this.navParams.get('image');
    this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log( this.userData ,this.name)
    this.my_uid1 = this.userData.user_id;
    console.log(this.data, "data");    
    this.gettingChatData();
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 50);
  }
  getProfilePicture(data) {
    if (data && (data != 'null')) {
      return data
    }
    else {
      return 'https://firebasestorage.googleapis.com/v0/b/mlm-staging.appspot.com/o/avatar-380-456332.webp?alt=media&token=36d130c4-5d41-4c5b-aa74-7519322519f1'
    }
  }
  convertTime(data) {
    console.log(data);
    if (data) {
      console.log(moment(data.toDate()).format('MMMM DD YYYY, h:mm a'));
      
      return moment(data.toDate()).format('MMMM DD YYYY, h:mm a')
      // return moment(data).format('HH:mm')
    }
    else {
      return ''
    }
  }
  gettingChatData() {
    var self = this;
    let my_data = JSON.parse(localStorage.getItem('userData'));
    this.my_profile = my_data.profile_image;
    this.User =this.my_uid1
    console.log(my_data)
    // let friend_uid2 = this.friend_data.id.toString()
    this.toUser = this.friend_uid2
    let chat_id;
    let message_data: any;
    var messages_path = firebase.firestore().collection('chats').where('uid', '==', this.my_uid1).get()
    messages_path.then(querySnapshot => {
      console.log(querySnapshot.size, "size");
      if (querySnapshot.size > 0) {

        querySnapshot.docs.map((data) => {
          this.message_ref = data.ref
          console.log(this.message_ref)

          data.ref.collection(this.friend_uid2).orderBy('time', 'asc').onSnapshot(snapshot => {
            console.log(snapshot);
            var msg_arr = [];

            if (snapshot.size > 0) {
              var message_data = snapshot.docs.map(snapdata => {
                snapdata.data().msg_id = snapdata.id
                snapdata.data().receiver_id = this.friend_uid2
                snapdata.data().sender_id = this.my_uid1
                snapdata.data().userAvatar = snapdata.data().userId == this.my_uid1 ? my_data.profile_image :this.image
                return snapdata.data();
              })
              console.log('all message:', message_data)
              self.msgList = message_data;
              this.scrollDown();
            }
          })
        })
      }
      else {
        this.message_ref = 'not_available';
      }
    })
  }
  goBack() {
    // this.navCtrl.popToRoot
    this.navCtrl.push(ProfilePage, {id:this.my_uid1} );
  }
  public sendMessage() {
    if (this.message) {
      let my_data = JSON.parse(localStorage.getItem('userData'));
      // let my_uid1 = my_data['id'].toString()
      // let friend_uid2 = JSON.parse(this.data).reciever_id.toString();
      let chat_id;
      let msg_data1 = {
        message: this.message,
        receiver_id: this.friend_uid2,
        sender_id: this.my_uid1,
        userId: this.my_uid1,
        time: firebase.firestore.FieldValue.serverTimestamp()
        // time: new Date()
      }
      console.log(msg_data1);
      // firebase.firestore().collection('chats').add(msg_data1);
      // this.message ='';
      if (this.message_ref == 'not_available') {
        console.log("if")
        firebase.firestore().collection('chats').doc(this.friend_uid2).set({ uid: this.friend_uid2 })
        firebase.firestore().collection('chats').doc(this.my_uid1).set({ uid: this.my_uid1 }).then(data => {
          console.log("data ref:", data);
          firebase.firestore().collection('chats').doc(this.my_uid1).collection(this.friend_uid2).add(msg_data1);
          firebase.firestore().collection('chats').doc(this.friend_uid2).collection(this.my_uid1).add(msg_data1)

          firebase.firestore().collection('chat_friend_list').doc(this.my_uid1).set(
            {
              time_stamp: moment(new Date()).unix()
            })

          firebase.firestore().collection('chat_friend_list').doc(this.friend_uid2).set(
            {
              time_stamp: moment(new Date()).unix()
            })

          firebase.firestore().collection('chat_friend_list').doc(this.my_uid1).collection('all_list').doc(this.friend_uid2).set(
            {
              last_msg: this.message,
              time_stamp: moment(new Date()).unix()
            })

          firebase.firestore().collection('chat_friend_list').doc(this.friend_uid2).collection('all_list').doc(this.my_uid1).set(
            {
              last_msg: this.message,
              time_stamp: moment(new Date()).unix()
            })
          //   })


          firebase.firestore().collection('chat_friend_list').doc(this.friend_uid2).collection(this.my_uid1).add(
            {
              last_msg: this.message,
              time_stamp: moment(new Date()).unix()
            })
          this.message = "";
          // this.scrollDown()
          this.events.publish('chat:created', Date.now());

         
        })
      }
      else {
        console.log("else");
        this.message_ref.collection(this.friend_uid2).add(msg_data1);
        firebase.firestore().collection('chats').doc(this.friend_uid2).collection(this.my_uid1).add(msg_data1)

        firebase.firestore().collection('chat_friend_list').doc(this.my_uid1).collection('all_list').doc(this.friend_uid2).set(
          {
            last_msg: this.message,
            time_stamp: moment(new Date()).unix()
          })

        firebase.firestore().collection('chat_friend_list').doc(this.friend_uid2).collection('all_list').doc(this.my_uid1).set(
          {
            last_msg: this.message,
            time_stamp: moment(new Date()).unix()
          })
        this.message = "";
        // this.scrollDown()
        this.events.publish('chat:created', Date.now());
        
        
      }

    }
  }
}
