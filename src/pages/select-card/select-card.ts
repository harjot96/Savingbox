import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from '../../providers';
import { ComponentProvider } from '../../providers/component/component';

/**
 * Generated class for the SelectCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-card',
  templateUrl: 'select-card.html',
})
export class SelectCardPage {
cards:any;
cardselected:any={};
cardData:any={};
  paymentInfo: any;
  constructor(public view:ViewController, public loading:LoadingController, public navCtrl: NavController, public navParams: NavParams,public api:Api,public alert:AlertController,public comp:ComponentProvider) {
    this.getCards();
    this.paymentInfo=this.navParams.get('data')
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCardPage');
  }

  getCards()
  {
    let loader=this.loading.create({
      content:'Please wait'
    })
    loader.present();
let fd = new FormData();
fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token)
    this.api.getCard('card_list.php',fd).subscribe((res:any)=>{
      console.log(res);
      this.cards=res.data
      loader.dismiss();
    })
  }

  payment()
  {
    let loader=this.loading.create({
      content:'Please wait'
    })
    loader.present();
    if(Object.keys(this.cardData).length!=0)
    {
      let fd=new FormData();
      fd.append('card_id ',this.cardselected.card_id);
      fd.append('cycle_id',this.paymentInfo.cycle_id);
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);


      this.api.post('charge_customer.php',fd).subscribe((res:any)=>{
        console.log(res);
        if(res)
        {
          loader.dismiss();
          this.view.dismiss();
          this.comp.presentToast(res.message)
        }
        
      })

    }
    else{
      loader.dismiss();

      let alert=this.alert.create({
        message:'Please select card for payment',
        mode:'ios',
        buttons:[{text:'Ok',
      role:'close'}]
      })
      alert.present();
    }
  }

  close()
  {
    this.view.dismiss()
  }

}
