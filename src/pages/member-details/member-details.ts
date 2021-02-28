import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,ModalController, AlertController } from 'ionic-angular';
import { Api } from '../../providers';
import { ProfilePage } from '../profile/profile';
import { ChatPage } from '../chat/chat';
import * as firebase from 'Firebase';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SuggestedFriendsPage } from "../suggested-friends/suggested-friends";
import { StaticalviewPage } from '../staticalview/staticalview';
import * as moment from 'moment';

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
// import { Router, ActivatedRoute ,ParamMap} from '@angular/router';
@IonicPage()
@Component({
  selector: 'page-member-details',
  templateUrl: 'member-details.html',
})
export class MemberDetailsPage {
  data:any='';
  loading:any='';
  cycleData:any='';
  newData: any = [];
  ref = firebase.database().ref('chatrooms/');
  rooms = []; 
  membersData: any = [];
  members_list: any = [];
  memberdsid: any = [];
  contact_list: any = [];
  constructor(public modalCtrl:ModalController,private contacts: Contacts,public api :Api,public navCtrl: NavController, public navParams: NavParams, public loadingController:LoadingController,public alert:AlertController) {
    this.data = JSON.parse(this.navParams.get('data')); 
    console.log(this.data,'Cycel detail');
    
    localStorage.setItem('members', JSON.stringify(this.data.users));
    console.log(this.data.users);
    this.getDataByTd();
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArray(resp);
      console.log(this.rooms, "rommmm")
    });
  }
  cycleStart(val)
  {
    return moment(val).format('MMMM DD YYYY')
  }

  ionViewDidLoad() {
    this.contactList();
    console.log('ionViewDidLoad MemberDetailsPage');
  }
  getData() {
    console.log(JSON.parse(localStorage.getItem('userData')).token);
    let loading = this.loadingController.create({ content: "Please wait..." });
    // this.loading.present();
    loading.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('phone', JSON.stringify(this.newData));
    this.api.post('member_list.php', fd).subscribe((res: any) => {
      loading.dismiss();
      console.log(res);
      // this.loading.dismiss();
      // this.membersData=[{
      //   email: "babitarawat98880@gmail.com",
      //   name: "Test",
      //   phone: "919779779646",
      //   profile_image: "",
      //   user_id: "12"
      // }];
      console.log("member", this.membersData)
      if (res.status == 'Success') {
        this.membersData = res['data'];
      } else {
        this.membersData = [];
      }
    }, err => {
      // this.loading.dismiss();
      loading.dismiss();
    });
  };
  presentMemberModal() {
    let profileModal = this.modalCtrl.create(SuggestedFriendsPage, { data: JSON.stringify(this.membersData), contact: JSON.stringify(this.contact_list) });
    profileModal.present();
    profileModal.onDidDismiss((result) => {
      if (result) {
        console.log(result, "datat");
        this.memberdsid = [];
        this.members_list = result;       
        this.members_list.forEach(element => {
          this.memberdsid.push(element.user_id);

        });
        let fd=new FormData();
        fd.append('cycle_id',this.data.cycle_id);
        fd.append('members_id',this.memberdsid);
        let loader = this.loadingController.create({
          content:'Please wait updating user.',
        })
        loader.present();
        fd.append('user_token',JSON.parse(localStorage.getItem('userData')).token)
        this.api.post('edit_cycle.php',fd).subscribe((res)=>{
         if(res)
         {
           console.log(res,'updated or not');
           loader.dismiss();
          //  let alert=this.alert.create({
          //    message:'Request has been sent to new members',
          //    buttons:[{
          //      text:'Ok',
          //      role:'close'
          //    }]
          //  })
          //  alert.present();
           
         }
        },err=>{
          if(err){
            loader.dismiss();
          }
        })
        debugger
        console.log(this.memberdsid);
        
      }
    });
  }
  contactList() {
    // this.getData();
     this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], { filter: "", multiple: true })
      .then(data => {
        data.forEach((element, key) => {
          var that = this;
          if (element['_objectInstance'].phoneNumbers != null) {
            element['_objectInstance'].phoneNumbers.forEach((ele, index) => {
              ele['number'] = ele.value;
              ele['name'] = element['_objectInstance'].displayName;
              ele['image'] = element['_objectInstance'].displayName;
              that.newData.push(ele.value);
            });
            if (element['_objectInstance'].phoneNumbers != null) {
              element['number'] = element['_objectInstance'].phoneNumbers[0].value;
            } else {
              element['number'] = null;
            }
            element['newname'] = element['_objectInstance'].displayName;
            if (element['_objectInstance'].photos != null) {
              element['photo'] = element['_objectInstance'].photos[0].value;
            } else {
              element['photo'] = null
            }
            this.contact_list.push(element);
          };
        });
        console.log(this.newData, "new");
        this.getData();
      });
  }
  staticView()
  {
    this.navCtrl.push(StaticalviewPage,{data:this.data})
  }

  addRoom(data) {
    let newData = this.ref.push();    
    if(this.rooms.length>0){
      var result = this.rooms.find( ({ roomid }) => roomid == data );
      console.log("cccc",result);
      // if(result == undefined ){
      //      newData.set({
      //         roomid:data
      //       });
      // }else{
      // this.joinRoom(result)
      // }
    }
    // this.navCtrl.pop();
  }
  joinRoom(res) {
    this.navCtrl.setRoot(ChatPage, {
      key:res.key,
      roomid:res.roomid
    });
  }

  getDataByTd(){
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('cycle_id',this.data.cycle_id);
    this.api.post('cycle_list.php', fd).subscribe((res: any) => {
      this.loading.dismiss();
      if (res.status == 'Success') {
        this.cycleData = res['data'];     
      } else {
        this.cycleData ='';
      }
    },err=>{
      this.loading.dismiss();
    })
  }
  userdetail(data){
    this.navCtrl.push(ProfilePage, {id:data} )
  }
}
