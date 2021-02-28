import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Events } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { SuggestedFriendsPage } from "../suggested-friends/suggested-friends";
import { Api } from '../../providers';
import { ComponentProvider } from '../../providers/component/component';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the NewCyclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-cycle',
  templateUrl: 'new-cycle.html',
})
export class NewCyclePage {
  allContacts: any = [];
  showAmount: boolean = false;
  loading: any = '';
  newCycleForm: FormGroup;
  customYearValues = [2020];
  today = moment(new Date()).format('YYYY-MM-DD');
  newData: any = [];
  payment_cycle: any = '0';
  payment_transaction: any = '0';
  membersData: any = [];
  members_list: any = [];
  memberdsid: any = [];
  contact_list: any = [];
  cycle_type: any = 'personal';
  addgoalVal: any = '';
  show = false;
  maxdate = (new Date().getFullYear() + 1) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  newDate:any;
  constructor(public events: Events, public formBuilder: FormBuilder, public componentProvider: ComponentProvider, public api: Api, public loadingController: LoadingController, public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts) {
    console.log(this.maxdate, "maxx", typeof this.maxdate)
    var futureMonth = moment(this.today).add(6, 'M');
    console.log(futureMonth, "future");
    this.newDate = moment(this.maxdate, 'YYYY-MM-DD').toDate();
    this.newDate = moment(this.newDate).format('YYYY-MM-DD');

    console.log(this.newDate, "MAXIMUM" ,typeof this.newDate)
    // this.membersData = [{ name: "babitarawat", phone: "919056711800", profile_image: "", user_id: "64" }, { name: "eee", phone: "919056711800", profile_image: "", user_id: "65" }]
    console.log(this.membersData)
    this.newCycleForm = this.formBuilder.group({
      title: ["", Validators.compose([Validators.required])],
      date: ["", Validators.compose([Validators.required])],
      deliver: ["", Validators.compose([Validators.required])],
      cycledur: ["", Validators.compose([Validators.required])],
      goal: ["", Validators.compose([Validators.required])],
      amount: ["", Validators.compose([Validators.required])],
      addgoal: [""]
    });
  }
  // ngOnInit(){
  //   this.contactList();
  // }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NewCyclePage');
    console.log(JSON.parse(localStorage.getItem('userData')).token);


  }
  ionViewWillEnter() {
    this.membersData=[];
    this.members_list = [];


    // this.maxdate = moment(this.maxdate).format('YYYY-MM-DD');
    // console.log(this.maxdate)
  }
  ionViewDidEnter() {
    this.contactList();
  }
  contactList() {
    // this.getData();
    // this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
    // this.loading.present();
    this.contacts.find(['*'], { filter: "", hasPhoneNumber:true,multiple: true })
      .then(data => {
        // this.loading.present();
        data.forEach((element, key) => {
          // console.log(element['_objectInstance'], "loggg",  element['_objectInstance'].displayName)
          //   console.log(element['_objectInstance'].phoneNumbers, "phonenumberArray")
          var that = this;
          if (element['_objectInstance'].phoneNumbers != null) {
            element['_objectInstance'].phoneNumbers.forEach((ele, index) => {
              console.log(ele,'######');
              
              ele['number'] = ele.value;
              ele['name'] = element['_objectInstance'].displayName;
              ele['image'] = element['_objectInstance'].displayName;
              // console.log(ele, "ele")
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
  boxChange(val) {
    console.log(val, "ggg", this.newCycleForm.value.addgoal);
    if (val == 'other') {
      this.show = true;
      this.newCycleForm.get('addgoal').setValidators(Validators.required);
      // this.newCycleForm.addControl('addgoal',this.formBuilder.control('',[Validators.required]));
      // this.newCycleForm['addgoal'] = ['', [Validators.required]];
      // this.newCycleForm.addControl('addgoal', new FormControl('', Validators.required));
      this.addgoalVal = this.newCycleForm.value.addgoal;
    } else {
      this.show = false;
      this.newCycleForm.get('addgoal').clearValidators();
      this.newCycleForm.get('addgoal').updateValueAndValidity();
      // this.newCycleForm.get('addgoal').setValidators([]);
      // this.newCycleForm.get('addgoal').setValidators();   
      this.addgoalVal = this.newCycleForm.value.goal;
    }
  }
  SelectedValue(val) {
    console.log(val, "value", this.cycle_type);
    if (this.cycle_type == 'personal') {
      this.memberdsid = [];
      this.members_list = [];
    }
  }
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
      }
    });
  }
  getData() {
    console.log(JSON.parse(localStorage.getItem('userData')).token);
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('phone', JSON.stringify(this.newData));
    this.api.post('member_list.php', fd).subscribe((res: any) => {
      console.log(res);
      this.loading.dismiss();
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
      this.loading.dismiss();
    });
  };

  newFormcycel(): void {
    debugger
    // if (this.members_list.length == 0 && this.cycle_type == 'group') {
    //   this.componentProvider.presentToast('Please add members first.')
    // } else {
    if (this.payment_cycle == '') {
      this.componentProvider.presentToast('Please select Payment cycle.')
    }
    if (this.payment_transaction == '') {
      this.componentProvider.presentToast('Please select transaction type.')
    }
    if (this.payment_cycle != '' && this.payment_transaction != '') {
      var member_val: any;
      if (this.cycle_type == 'personal') {
        member_val = '';
      } else {
        member_val = this.memberdsid.toString();
      }
     if(this.newCycleForm.controls.amount.value<=500){
      console.log(JSON.parse(localStorage.getItem('userData')).token);
      this.loading = this.loadingController.create({ content: "Please wait..." });
      this.loading.present();
      let fd = new FormData();
      fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
      fd.append('title', this.newCycleForm.value.title);
      fd.append('start_date', this.newCycleForm.value.date);
      fd.append('delivery_every', this.newCycleForm.value.deliver);
      fd.append('cycle_duration', this.newCycleForm.value.cycledur);
      fd.append('payment_type', this.payment_cycle);
      fd.append('transaction_type', this.payment_transaction);
      fd.append('goals', this.addgoalVal);
      fd.append('amount', this.newCycleForm.value.amount)
      fd.append('cycle_type', this.cycle_type);
      fd.append('members_id', member_val);
      this.api.post('create_cycle.php', fd).subscribe((res: any) => {
        console.log(res);
        this.loading.dismiss();
        this.componentProvider.presentToast(res.message);
        if (res.status == 'Success') {
          this.events.publish('cycle:created', Date.now());
          this.payment_cycle = '0';
          this.payment_transaction = '0';
          this.newCycleForm.reset();
          this.memberdsid = [];
          this.members_list = [];
          localStorage.removeItem("members");
          this.navCtrl.parent.select(0);
          //  this.app.getRootNav().getActiveChildNav().select(0);
          //  this.router.navigate([ 'TabsPage', 'home' ]);
          //  this.navCtrl.setRoot('TabsPage')
          // this.membersData = res['data'];
        } else {
          // this.membersData = [];
        }
      }, err => {
        this.loading.dismiss();
      });
     }
     else{
 this.componentProvider.presentToast('Maximum Box Amount is $500')
    }

    }
    // }

  }
  setAmount() {
    console.log(this.newCycleForm);
    
    this.showAmount = true;
  }
}
