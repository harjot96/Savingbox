import { TabsPageModule } from './../pages/tabs/tabs.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Items } from '../mocks/providers/items';
import { Settings, User, Api } from '../providers';
import { MyApp } from './app.component';
import { SignupPageModule } from '../pages/signup/signup.module';
import { SigninPageModule } from '../pages/signin/signin.module';
import { ChangepasswordPageModule } from '../pages/changepassword/changepassword.module';
import { ProfileDetailsPageModule } from '../pages/profile-details/profile-details.module';
import { PaymentMethodPageModule } from '../pages/payment-method/payment-method.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MyProfilePageModule } from '../pages/my-profile/my-profile.module';
import { HomePageModule } from '../pages/home/home.module';
import { SuggestedFriendsPageModule } from '../pages/suggested-friends/suggested-friends.module';
import { TutorialPageModule } from '../pages/tutorial/tutorial.module';
import { CreateProfilePageModule } from '../pages/create-profile/create-profile.module';
import { ForgetPasswordPageModule } from '../pages/forget-password/forget-password.module';
import { ChatPageModule } from '../pages/chat/chat.module';
import { OtpPageModule } from '../pages/otp/otp.module';
import { NotificationsPageModule } from '../pages/notifications/notifications.module';
import { MemberDetailsPageModule } from '../pages/member-details/member-details.module';
import { NewCyclePageModule } from '../pages/new-cycle/new-cycle.module';
import { UploaddocsPageModule } from '../pages/uploaddocs/uploaddocs.module';
import { AddRoomPageModule } from '../pages/add-room/add-room.module';
import { ComponentProvider } from '../providers/component/component';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Stripe } from '@ionic-native/stripe';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgxGaugeModule } from 'ngx-gauge';
// import { FCM } from '@ionic-native/fcm';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ChatroomPageModule } from '../pages/chatroom/chatroom.module';
import { StaticalviewPageModule } from '../pages/staticalview/staticalview.module';
import { PrivacyPolicyPageModule } from '../pages/privacy-policy/privacy-policy.module';
import { NgxCurrencyModule } from "ngx-currency";
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ngx-currency-mask/src/currency-mask.config';
import { StaticalviewPage } from '../pages/staticalview/staticalview';
import { WalletpagePage } from '../pages/walletpage/walletpage';
import { WalletpagePageModule } from '../pages/walletpage/walletpage.module';
import { WallettobankPageModule } from '../pages/wallettobank/wallettobank.module';
import { SendmoneyconfirmationPageModule } from '../pages/sendmoneyconfirmation/sendmoneyconfirmation.module';
import { SelectCardPage } from '../pages/select-card/select-card';
import { SelectCardPageModule } from '../pages/select-card/select-card.module';
import { OneSignal } from '@ionic-native/onesignal';
// import { HttpModule } from '@angular/http';
// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "center",
  allowNegative: true,
  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: "R$ ",
  suffix: "",
  thousands: "."
};


export function provideSettings(storage: Storage) {

  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });

}

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    WalletpagePageModule,
    SignupPageModule,
    WallettobankPageModule,
    SendmoneyconfirmationPageModule,
    SigninPageModule,SelectCardPageModule,
    ChangepasswordPageModule,
    ProfileDetailsPageModule,
    PaymentMethodPageModule,
    ProfilePageModule,
    HomePageModule,
    StaticalviewPageModule,
    TabsPageModule,
    AddRoomPageModule,
    UploaddocsPageModule,
    // HttpModule,
    NgxGaugeModule,
    MyProfilePageModule,
    SuggestedFriendsPageModule,
    TutorialPageModule,
    HttpClientModule,
    ChatroomPageModule,
    CreateProfilePageModule,
    ForgetPasswordPageModule,
    ChatPageModule,
    PrivacyPolicyPageModule,
    OtpPageModule,
    NgxCurrencyModule,
    NotificationsPageModule,
    MemberDetailsPageModule,
    NewCyclePageModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
    Api,
    Items,
    Stripe,
    User,
    Camera,
    SplashScreen,
    StatusBar,
    Facebook,
    GooglePlus,
    Contacts,
    Push,
    OneSignal,
    // FCM,
    SocialSharing,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ComponentProvider
  ]
})
export class AppModule { }
