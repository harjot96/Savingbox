import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers';
import * as moment from 'moment';


/**
 * Generated class for the WalletpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-walletpage',
  templateUrl: 'walletpage.html',
})
export class WalletpagePage {
walletCash:number;
  bankAccount: any;
  transaction: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public api:Api) {
    this.getTransaction();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletpagePage');

  }
  ionViewWillEnter(){
    this.getWalletout();
    this.getTransaction();

  }
  tranferAmount()
  {
    this.navCtrl.push('WallettobankPage')
  }
  convertTime(data) {
return    moment(data).format('DD MMMM YYYY, h:mm:ss a')
  }

 
  getWalletout()
  {
let fd=new FormData();
fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);

    this.api.post('wallet.php',fd).subscribe((res:any)=>{
      console.log(res);
      if(res.status == "Success"){
        this.walletCash=JSON.parse(res.data.wallet)
      }else{
        this.walletCash=0;

      }
      localStorage.setItem('walletamount',JSON.stringify(this.walletCash));
      
    })
  }

  getTransaction()
  {
    let fd=new FormData();
    fd.append('user_token',JSON.parse(localStorage.getItem('userData')).token)
    this.api.post('transactions_history.php',fd).subscribe((res:any)=>{
      console.log(res);
      this.transaction=res.data
      
    })
  }

}
