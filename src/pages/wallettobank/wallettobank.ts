import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api } from '../../providers';
import { PagesAddbankPage } from '../pages-addbank/pages-addbank';
import { SendmoneyconfirmationPageModule } from '../sendmoneyconfirmation/sendmoneyconfirmation.module';
import { ComponentProvider } from '../../providers/component/component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


/**
 * Generated class for the WallettobankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wallettobank',
  templateUrl: 'wallettobank.html',
})
export class WallettobankPage {
  bankAccount: any;
  amount: any = '';
  transferamount: any = '';
  autoManufacturers: any = '';
  changeppassword: FormGroup;

  constructor(public formBuilder: FormBuilder,public componentProvider: ComponentProvider, public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.changeppassword = this.formBuilder.group({
      bankid: [ "",Validators.compose([ Validators.required,])]
    });
  }
  myFunction() {
    console.log("1");

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WallettobankPage');

  }
  ionViewWillEnter() {
    this.amount = JSON.parse(localStorage.getItem('walletamount'));
    this.getbankAccounts();
  }
  slice(str)
  {
   return str.slice(str.length - 5);
  }
  save() {
    console.log(this.transferamount, this.amount)
    if (this.transferamount == '') {
      this.componentProvider.presentToast('Enter transfer amount.')

      return false;
    }
    if (Number(this.amount) >= Number(this.transferamount)) {
      this.redeem();
    } else {
      this.componentProvider.presentToast('Transfer amount should not greater than wallet amount.')

    }
  }
  addAccount() {
    this.navCtrl.push('PagesAddbankPage')
  }
  redeem(){
    console.log(this.autoManufacturers, "ggg") 
    // return false;
    if(this.autoManufacturers==undefined || this.autoManufacturers==null || this.autoManufacturers==''){
      this.componentProvider.presentToast('Please select card first.');
      return false;
    }
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    fd.append('amount', this.transferamount);
    fd.append('account_id', this.autoManufacturers);    
    this.api.post('redeem_amount.php', fd).subscribe((Res: any) => {
      console.log(Res, "++++++++++++++");
      this.componentProvider.presentToast(Res.message);
      this.navCtrl.pop();
    
    })
  }
  getbankAccounts() {
    let fd = new FormData();
    fd.append('user_token', JSON.parse(localStorage.getItem('userData')).token);
    this.api.post('bank_list.php', fd).subscribe((Res: any) => {
      console.log(Res);
      this.bankAccount = Res.data;
      if (this.bankAccount.length == 1) {
        this.autoManufacturers = this.bankAccount[0].id;
      }
    })
  }


}
