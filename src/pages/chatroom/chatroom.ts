import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Keyboard, Content, ToastController, LoadingController, AlertController } from 'ionic-angular';
// import { ActionSheetController, AlertController, ModalController, IonContent } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
declare var Pusher: any;
import { AddRoomPage } from '../add-room/add-room';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Api } from '../../providers';
import * as moment from 'moment';

/**
 * Generated class for the ChatroomPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatroom',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {
  @ViewChild(Content) content: Content;
  config: any;
  all_friends_data: Observable<any[]>
  friend_list_data: any = [];
  newdata: any = '';
  total_friends: string[];
  user_id: any;
  loading;
  total_chat_friends_list: any;
  chat_friends_docs: firebase.firestore.QueryDocumentSnapshot[];
  chat_friends_list;
  total_chat_friends_data_list: any = [];
  user_data: any = '';
  client_info: any = '';
  dailCode: any = '';
  // @ViewChild(IonContent) content: IonContent;
  pageNum: any = 1;
  totalPages = 0;
  message: any = '';
  messagelist: any = [];
  to_id: any = '';
  image = '';
  phone: any = '';
  sendername: any = '';
  blockclient_by_barber: any = '';
  rooms = [];
  ref = firebase.database().ref('chatrooms/');
  data = { type: '', nickname: '', message: '' };
  chats = [];
  roomkey: string;
  nickname: string;
  offStatus: boolean = false;
  noData:boolean = false;
  constructor(public alert:AlertController, public loadingController: LoadingController, public api: Api, public navCtrl: NavController, public navParams: NavParams, private keyboard: Keyboard, public events: Events, private camera: Camera) {
    this.user_data = JSON.parse(localStorage.getItem('userData'));
    // this.events.subscribe("chat:created", (data: any) => {
    //   this.friend_list_data = [];
    //  this.total_chat_friends_data_list = [];
    //   this.getAllChatFriendsList();
    // });
 
  }
  ionViewDidEnter() {
    this.noData = false;
    this.getAllChatFriendsList();
    console.log("ddd");
    if(this.total_chat_friends_data_list.length===0)
    {
      let alert=this.alert.create({
        message:'To chat, tap on a member on the Group Box',
        mode:'ios',
        buttons:[{
          text:'Ok',
          role:'Close'
        }]
      })
      alert.present();
    }
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ChatPage');
  //   this.getAllChatFriendsList();
  // }
  getData(id) {
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('user_id', id);
    return this.api.post('user_profile.php', fd);
    // .subscribe((res: any) => {
    // if (res.status == 'Success') {
    //     return this.newdata = res['data'];  
    //     console.log(this.data); 
    //   } else {
    //     return this.newdata ='';
    //   }
    // },err=>{
    // })
  }

  getAllChatFriendsList() {
    if (!this.loading) {
      this.loading = this.loadingController.create({ content: "Please wait..." });
      this.loading.present();
    }

    const self = this;
    var uid = this.user_data.user_id;
    if (this.friend_list_data.length == 0) {
      firebase.firestore().collection('chat_friend_list').doc(`${uid}`).onSnapshot(docsnapshot => {
        docsnapshot.ref.collection('all_list').orderBy('time_stamp', 'desc').onSnapshot((snapshot) => {
          if (snapshot.docs.length > 0) {
            self.total_chat_friends_data_list = [];
            self.chat_friends_docs = snapshot.docs
            console.log("self.chat_friends_docs", self.chat_friends_docs, self.chat_friends_list)
            self.friend_list_data = [];
            self.chat_friends_docs.forEach((item, index) => {
              this.getData(item.id).subscribe((res) => {
                console.log(res, "response");
                this.client_info = res['data'];
                console.log(item.data());
                console.log(self.chat_friends_list, "sss")
                var friend_data = {
                  user_id: item.id,
                  profile: this.client_info,
                  last_message: item.data().last_msg,
                  time_stamp: item.data().time_stamp
                }
                self.total_chat_friends_data_list.push(friend_data);
                this.noData = true;
                console.log("self.total_chat_friends_data_list", self.total_chat_friends_data_list);
              })
            })
          }
          else {
            console.log("self.total_chat_friends_data_list:::", self.total_chat_friends_data_list)
            this.noData = true;
            self.total_chat_friends_data_list = [];
          }
          if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
          }
        })
      })
    }
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }
  goTo(user_id, username, img) {
    console.log(username)
    this.navCtrl.push(AddRoomPage, { 'friendid': user_id, 'name': username, 'image': img });
    // this.navCtrl.setRoot(AddRoomPage, {'friendid': this.data.user_id, 'image':this.data.profile_image});
  }
  sendMessage() {
    let newData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    newData.set({
      type: this.data.type,
      user: this.data.nickname,
      message: this.data.message,
      notification: {
        title: 'Hi', 
        body: 'Notification from Saving Box',
        click_action: 'FCM-PLUGIN-ACTIVITY'             
    },
      sendDate: Date()
    });
    this.data.message = '';
    this.events.publish('chat:created', new Date());

  }
  convertTime(data) {
    if (data) {
      var timestamp = moment.unix(data)
 return timestamp.format('MMMM DD YYYY, h:mm a')
    }
    else {
      return ''
    }
  }
  getMessages() {
    const token = JSON.parse(localStorage.getItem('userData')).token;
    const url = '/chat/get-chat-list';
    const params = {
      to_id: this.to_id,
      // page:this.pageNum
    };
    // this.api.postToken(url,token, params).subscribe(data => {
    //   console.log('Send Messages:- ', data);
    //   if (data.status=='success') {
    //     this.messagelist = data.data;
    //       setTimeout(() => {
    //       this.updateScroll();
    //     }, 200);
    //     // this.totalPages = Math.ceil(parseInt(data.total_count) / 10);
    //   }
    // }, err => {
    //   console.log('Get Messages err', err);
    // });
  }
  exitChat() {
    let exitData = firebase.database().ref('chatrooms/' + this.roomkey + '/chats').push();
    exitData.set({
      type: 'exit',
      user: this.nickname,
      message: this.nickname + ' has exited this room.',
      sendDate: Date()
    });

    this.offStatus = true;

    // this.navCtrl.setRoot(RoomPage, {
    //   nickname:this.nickname
    // });
  }

  // openCamera(sourceType){
  // const options: CameraOptions = {
  //     quality: 20,
  //     sourceType: sourceType,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     targetWidth: 300,
  //     targetHeight: 300,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //        this.image= 'data:image/jpeg;base64,' + imageData;
  //        this.sendMessage();
  //        console.log( this.image);
  //   }, (err) => {
  //    alert(JSON.stringify(err))
  //   });

  // }

  // async selectImage() {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: "Select Image source",
  //     buttons: [{
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
  //       }
  //     },
  //     {
  //       text: 'Use Camera',
  //       handler: () => {
  //         this.openCamera(this.camera.PictureSourceType.CAMERA);
  //       }
  //     },
  //     {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

}