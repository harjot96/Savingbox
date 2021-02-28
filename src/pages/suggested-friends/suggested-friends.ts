import { Component,ChangeDetectorRef  } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform } from 'ionic-angular';
import { PaymentMethodPage } from '../payment-method/payment-method';
import { ThrowStmt } from '@angular/compiler';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FormControl } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
/**
 * Generated class for the SuggestedFriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-suggested-friends',
  templateUrl: 'suggested-friends.html',
})
export class SuggestedFriendsPage {
  membersData:any=[]
  suggestData:any=[];
  selectedData:any=[];
  searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    searching: any = false;
  arrayData: any;
  fileterdata: any;
  showFilter: boolean=false;
  constructor(public plt:Platform, public changeRef:ChangeDetectorRef, private socialSharing: SocialSharing,public viewController:ViewController,public navCtrl: NavController, public navParams: NavParams, public modalController:ModalController) {
   
    this.searchControl = new FormControl();
       
  }
 

  ionViewDidLoad() {
    this.suggestData=[];
    this.membersData=[];
    this.selectedData=[];
    this.arrayData=[];
    console.log('ionViewDidLoad SuggestedFriendsPage');
    console.log(JSON.parse(this.navParams.get('data')));
    this.membersData = JSON.parse(this.navParams.get('data')); 
    this.arrayData = JSON.parse(this.navParams.get('contact'));   
      if(this.plt.is('android'))
      {
       this.suggestData=this.arrayData.sort(function(a, b){
         if(a.newname < b.newname) { return -1; }
         if(a.newname > b.newname) { return 1; }
         return 0;
     })
      }
     if(this.plt.is('ios'))
     {
       this.suggestData=this.arrayData.sort(function(a, b){
         if(a._objectInstance.name.formatted < b._objectInstance.name.formatted) { return -1; }
         if(a._objectInstance.name.formatted > b._objectInstance.name.formatted) { return 1; }
         return 0;
     })
     }
    this.changeRef.detectChanges();
    console.log(JSON.parse(localStorage.getItem('members')), this.selectedData);
    console.log(this.suggestData);
    if(localStorage.getItem('members') && localStorage.getItem('members') !=null){
      var checkData = JSON.parse(localStorage.getItem('members'));
      console.log(checkData)
      if(checkData.length>0){
       checkData.forEach(element => {
         this.membersData.forEach((ele,key) => {
            if(element.user_id == ele.user_id){
              //turn it to true hs has chage it
              this.membersData[key].selected = false;
              // uncomment this code also
              //  this.selectedData.push(this.membersData[key]);
            }
          });            
        });
        console.log(this.membersData, "mem")
      }    
    }
  }
  filterTechnologies(param : any) : void
  {
  
     let val : string 	= param.target.value;
  
     // DON'T filter the technologies IF the supplied input is an empty string
     if (val && val.trim() !== ''&& val.length>3) 
     {
       this.showFilter=true;
        this.fileterdata = this.suggestData.filter((item) => 
        {
          if(item.newname!=null)
          {
            return item.newname.toLowerCase().indexOf(val.trim().toLowerCase()) > -1; 
          }
          else{
            return item._objectInstance?.name?.formatted.toLowerCase().indexOf(val.trim().toLowerCase()) > -1; 
            
          }
        })
        console.log(this.fileterdata);
      }
      else{
        this.showFilter=false;
      } 
  }
  sendsuggestion(data){
  
    
      var shareMessage= "\nYou have been invited to join a Savings Box! Click here to download!\n\n";
      var message= shareMessage + "https://appurl.io/2hIXEZS8_"+'\n'+'Thanks for your interest in our App!';
      var phone = data.number;
      console.log(message, phone);
      this.socialSharing.shareViaSMS(message,phone).then(() => {
        console.log("share")
        // Sharing via email is possible
      }).catch(() => {
        console.log("nit share")
        // Sharing via email is not possible
      });
  }
  
  gotoPaymentMethod() {
    this.navCtrl.setRoot(PaymentMethodPage);
  }
  close(){
    this.viewController.dismiss(this.selectedData);
  }
  add(data){
    this.membersData.forEach((element, key) => {
      if(data.user_id == element.user_id){
        if(this.membersData[key]['selected']){
          if(this.membersData[key]['selected'] == true){
            this.selectedData.forEach((e ,k) => {
              if(e.user_id == this.membersData[key].user_id){
                this.selectedData.splice(k, 1);
                }
            });
           this.membersData[key]['selected'] = false;
          }else if(this.membersData[key]['selected'] == false){
            this.selectedData.push(element);
            this.membersData[key]['selected'] = true;
          }else{}
        }else{
          this.selectedData.push(element);
          this.membersData[key]['selected'] = true;
        }
      }
    });
    console.log(this.membersData,"mmeber", this.selectedData)
    localStorage.setItem('members', JSON.stringify(this.selectedData));
  }
}
