import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IonicPage, NavController, ToastController, LoadingController, AlertController, ViewController } from "ionic-angular";

/*
  Generated class for the ComponentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ComponentProvider {
  constructor(public http: HttpClient, 
    public toastCtrl: ToastController,public loadingCtrl:LoadingController,
    public alertCtrl:AlertController) {
    console.log("Hello ComponentProvider Provider");
  }
  presentToast(data) {
    let toast = this.toastCtrl.create({
      message: data,
      duration: 4000,
      position: "bottom",
    });
    toast.present();
  }

  presentLoader(msg:string){
    let loader=this.loadingCtrl.create({
       content:msg
    })
    loader.present();
    setTimeout(() => {
      loader.dismiss();
    }, 5000)
  }
 
}
