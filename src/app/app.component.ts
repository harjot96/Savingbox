
import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { App, Config, Nav, Platform, AlertController, Tabs, Events } from 'ionic-angular';
import { TabsPage } from '../pages//tabs/tabs';
import { Settings } from '../providers';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SigninPage } from '../pages/signin/signin';
import { NotificationsPage } from '../pages/notifications/notifications';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import * as firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal';
import { PaymentMethodPage } from '../pages/payment-method/payment-method';
// import { FCM } from '@ionic-native/fcm';
const fconfig = {
  apiKey: "AIzaSyDe0STnUZroDCGjNCrxCMPewdc3DXlj2b8",
  authDomain: "savingbox.firebaseapp.com",
  databaseURL: "https://savingbox.firebaseio.com",
  projectId: "savingbox",
  storageBucket: "savingbox.appspot.com",
  messagingSenderId: "240353357660",
  appId: "1:240353357660:web:979a2d654bf049005c5b99",
  measurementId: "G-9XHW9NMB0E"
};
@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  // rootPage = TutorialPage;
  rootPage: any;
  @ViewChild(Nav) nav: Nav;
  @ViewChild('paymentTabs') tabs: Tabs;
  alert: any;
  notify: any = '';
  options: PushOptions = {
    android: {
      senderID: '610384861171'
    },
    ios: {
      alert: 'true',
      badge: false,
      sound: 'true'
    },
    windows: {}
  };
  pushObject: PushObject = this.push.init(this.options);
  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Settings', component: 'SettingsPage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(
    private platform: Platform,
    settings: Settings,
    private config: Config,
    private statusBar: StatusBar,
    public app: App,
    private oneSignal: OneSignal,
    private events: Events,
    private alertCtrl: AlertController,
    private splashScreen: SplashScreen,
    // private fcm: FCM,
    private push: Push) {

    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
      firebase.initializeApp(fconfig);
      if (localStorage.getItem('userData') != undefined && localStorage.getItem('userData') != null) {
        console.log("dsf")
        this.rootPage = TabsPage;
        // this.nav.setRoot(TabsPage);
      } else {
        this.rootPage = TutorialPage;
      }
    });

    platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNavs()[0];
      let activeView = nav.getActive();
      // Checks if can go back before show up the alert
      if (activeView.name === 'HomePage') {
        if (nav.canGoBack()) {
          nav.pop();
        } else {
          if (this.alert) {
            this.alert.dismiss();
            this.alert = null;
          } else {
            this.showAlert();
          }

        }
      }
    });
    this.pushObject.on('notification').subscribe(async (notification: any) => {
      console.log('Received a notification', notification)
      var that = this;
      if (this.platform.is('ios')) {
        this.notify = JSON.parse(
          notification.additionalData["gcm.notification.additional"]
        );
      } else {
        this.notify = notification.additionalData.additional;
      }
      if (notification.additionalData.foreground) {

        const alert = await this.alertCtrl.create({
          title: 'New Notification',
          message: notification.message,
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              handler: (blah) => {
                console.log("Confirm Cancel: blah");
              },
            },
            {
              text: "View",
              handler: () => {
                if (localStorage.getItem('userData') != undefined && localStorage.getItem('userData') != null) {
                  console.log("dsf")
                  this.rootPage = NotificationsPage;
                  this.nav.setRoot(NotificationsPage);
                } else {
                  this.nav.setRoot(TutorialPage);
                }
                console.log("Confirm Okay");
              },
            },
          ],
        });
        await alert.present();


      } else {
        if (notification.additionalData.coldstart) {
          if (localStorage.getItem('userData') != undefined && localStorage.getItem('userData') != null) {
            console.log("dsf")
            this.rootPage = NotificationsPage;
            this.nav.setRoot(NotificationsPage);
          } else {
            this.nav.setRoot(TutorialPage);
          }
        }
      }

    });

  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert = null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }
  initPushNotification() {
    this.oneSignal.startInit('6ddfc1a1-64e8-4f3b-aa54-70fe36a43e8e', '240353357660');
    this.oneSignal.getIds().then((res)=>{
      localStorage.setItem('player_id',res.userId)
    })
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });
    this.oneSignal.handleNotificationOpened().subscribe(() => {

    });
   
    this.oneSignal.endInit();

    // if (!this.platform.is('cordova')) {
    //   console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
    //   return;
    // }
    // console.log("elss++++++++++++")

    // this.pushObject.on('registration').subscribe((data: any) => {
    //   console.log('device token -> ' + data.registrationId);
    //   localStorage.setItem('device_token',JSON.stringify(data.registrationId));
    //   //TODO - send device token to server
    // });
    // this.pushObject.on('error').subscribe(error => console.error('Error with Push plugin'+error));


    // this.platform.ready().then(() => {
    //   //Notifications
    //   this.fcm.subscribeToTopic('all');
    //   this.fcm.getToken().then(token=>{
    //     localStorage.setItem('device_token',JSON.stringify(token));
    //       console.log(token);
    //   })
    //   this.fcm.onNotification().subscribe(data=>{
    //     if(data.wasTapped){
    //       console.log("Received in background");
    //     } else {
    //       console.log("Received in foreground");
    //     };
    //   })
    //   this.fcm.onTokenRefresh().subscribe(token=>{
    //     console.log(token);
    //   });
    //   //end notifications.
    //  });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
