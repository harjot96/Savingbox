import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Keyboard,Content } from 'ionic-angular';
// import { ActionSheetController, AlertController, ModalController, IonContent } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
declare var Pusher: any;
import { AddRoomPage } from '../add-room/add-room';
import { HomePage } from '../home/home';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import * as moment from 'moment';


// export const snapshotToArray = snapshot => {
//   let returnArr = [];
  
//   snapshot.forEach(childSnapshot => {
//       let item = childSnapshot.val();
//       item.key = childSnapshot.key;
//       returnArr.push(item);
//   });

//   return returnArr;
// };
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('pageTop') pageTop: Content;
  @ViewChild(Content) content: Content;
  config: any;
  all_friends_data: Observable<any[]>
  friend_list_data: any = [];

  total_friends: string[];
  user_id: any;
  total_chat_friends_list: any;
  chat_friends_docs: firebase.firestore.QueryDocumentSnapshot[];
  chat_friends_list;
  total_chat_friends_data_list: any = [];
  user_data:any='';
  dailCode:any='';
    // @ViewChild(IonContent) content: IonContent;
    pageNum: any = 1;
    totalPages = 0;
    message:any='';
    messagelist:any=[];
    to_id:any='';
    image='';
    phone:any='';
    sendername:any='';
    blockclient_by_barber:any='';
    rooms = [];
    ref = firebase.database().ref('chatrooms/');    
    data = { type:'', nickname:'', message:'' };
    chats = [];
    roomkey:string;
    nickname:string;
    offStatus:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private keyboard: Keyboard, public events:Events,private camera: Camera) {
    this.user_data = JSON.parse(localStorage.getItem('userData'));
    this.events.subscribe('chat:created', (time) => {
      this.total_chat_friends_list= [];
      this.chat_friends_docs = [];
      this.chat_friends_list = [];
      this.total_chat_friends_data_list = [];
      this.getAllChatFriendsList();
    });
    // this.ref.on('value', resp => {
    //   this.rooms = [];
    //   this.rooms = snapshotToArray(resp);
    //   console.log(this.rooms, "rommmm")
    // });
    // this.roomkey = this.navParams.get("key") as string;
    // this.nickname = this.navParams.get("nickname") as string;
    // this.data.type = 'message';
    // this.data.nickname = this.nickname;
  
    // let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    // joinData.set({
    //   type:'join',
    //   user:this.nickname,
    //   message:this.nickname+' has joined this room.',
    //   sendDate:Date()
    // });
    // this.data.message = '';
  
    // firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
    //   this.chats = [];
    //   this.chats = snapshotToArray(resp);
    //   setTimeout(() => {
    //     if(this.offStatus === false) {
    //       this.content.scrollToBottom(300);
    //     }
    //   }, 1000);
    // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
    this.getAllChatFriendsList();

  }
  getAllChatFriendsList() {
    const self = this;
    var uid = this.user_data.user_id;
    if (this.friend_list_data.length == 0) {
      // firebase.firestore().collection('chats')
      firebase.firestore().collection('chat_friend_list').doc(`${uid}`).onSnapshot(docsnapshot => {

        docsnapshot.ref.collection('all_list').orderBy('time_stamp', 'desc').onSnapshot((snapshot) => {
          if (snapshot.docs.length > 0) {

            self.total_chat_friends_data_list = [];
            self.chat_friends_docs = snapshot.docs
            // console.log("self.chat_friends_docs", self.chat_friends_docs)
            self.friend_list_data = [];
            self.chat_friends_docs.forEach((item, index) => {
              // console.log('action.payload.val()', item.data());
              // self.chat_friends_list =  this.data_provider.getDashboardUserList().subscribe(data => {
              //   return data;
              // });
              // console.log("self.chat_friends_list", self.chat_friends_list);
              // console.log("chat_friends_list:", self.chat_friends_list);
              // self.chat_friends_list.map(res => {
              // console.log("res:", res, "++++++++++++++++++++++++", res.length)
              for (let key in self.chat_friends_list) {
                // console.log(self.chat_friends_list[key])
                // res.forEach(element => {
                  if (self.chat_friends_list[key]['id'] == item.id) {
                    // console.log("element:", element);
                    var friend_data = {
                      user_id: item.id,
                      personal_detail: self.chat_friends_list[key],
                      last_message: item.data().last_msg,
                      time_stamp: item.data().time_stamp
                    }
                    self.total_chat_friends_data_list.push(friend_data);
                  }
                //   // 
                // });
                // });
              }
              console.log("self.total_chat_friends_data_list", self.total_chat_friends_data_list);

              // if(index==self.total_friends.length-1){
              //   console.log("arr",arr)
              //   self.friend_list_data=arr;
              //   console.log("self.friend_list_data:::", self.friend_list_data)
              // }
            })


          }
          else {
            console.log("self.total_chat_friends_data_list:::", self.total_chat_friends_data_list)
            self.total_chat_friends_data_list = [];
          }
          // self.total_friends = Object.keys(snapshot.val())
        })
      })
    }
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }
  sendMessage() {
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });
    this.data.message = '';
  }

  getMessages(){
    const token = JSON.parse(localStorage.getItem('userData')).token;
  const url = '/chat/get-chat-list';
  const params = {
    to_id:this.to_id,
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
  let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
  exitData.set({
    type:'exit',
    user:this.nickname,
    message:this.nickname+' has exited this room.',
    sendDate:Date()
  });

  this.offStatus = true;

  // this.navCtrl.setRoot(RoomPage, {
  //   nickname:this.nickname
  // });
}
updateScroll() {
  // console.log('+++++', this.content);
  this.pageTop.scrollToTop().then(val => {
  // this.content.scrollToBottom().then(val => {
    console.log(val);
  }).catch(err => {
  });
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
