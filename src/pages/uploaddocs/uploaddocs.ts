import { Component } from '@angular/core';
import { IonicPage, NavController,ActionSheetController, NavParams,LoadingController ,Events} from 'ionic-angular';
import { ProfileDetailsPage } from '../profile-details/profile-details';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Api } from '../../providers';
import { ComponentProvider } from "../../providers/component/component";

/**
 * Generated class for the UploaddocsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-uploaddocs',
  templateUrl: 'uploaddocs.html',
})
export class UploaddocsPage {
  imageUpload:any='';
  loading:any='';
  userData:any='';
  expdate:any='';
  issueDate:any='';
  doctype:any='';
  country:any='';
  state:any='';
  idnumber:any='';
  imagestatus:any= 0;
  constructor(public events:Events,public componentProvider:ComponentProvider, public api:Api,public loadingController:LoadingController,private camera: Camera, public actionSheetController: ActionSheetController,public navCtrl: NavController, public navParams: NavParams) {
    this.userData = JSON.parse(localStorage.getItem("userData"));  
   
    this.events.subscribe("doc:created", (data: any) => {
      // this.view();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploaddocsPage');
    this.view(); 
  }
  goBack() {
    this.navCtrl.push(ProfileDetailsPage);
  }
  openCamera(sourceType) {
    const options: CameraOptions = {
      quality: 30,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 300,
      targetHeight: 300,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageUpload = 'data:image/jpeg;base64,' + imageData;
      this.imagestatus = 1;
    }, (err) => {
      // Handle error
      alert(JSON.stringify(err))
    });

  }
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.openCamera(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  upload(){
    console.log(this.issueDate+this.expdate);
    
  if(this.doctype != '' && this.idnumber !='' && this.imageUpload!='' && this.expdate!='' && this.issueDate!='' && this.country!='' && this.state!=''){
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd=new FormData();
    fd.append('docimage',this.imageUpload),
    fd.append('idtype',this.doctype),
    fd.append('user_token',this.userData.token),
    fd.append('idnumber',this.idnumber),
    fd.append('image_status',this.imagestatus);   
    fd.append('state',this.state);
    fd.append('country',this.country);
    fd.append('issueDate',this.issueDate);   

    fd.append('expiryDate',this.expdate);   

    this.api.post('add_doc.php',fd).subscribe((res:any)=>{
    console.log(res);
    this.loading.dismiss();
    this.componentProvider.presentToast(res.message)
    if(res.status=='Success'){     
      this.imagestatus = 0;
      this.navCtrl.pop();
      this.events.publish('doc:ceated', Date.now());
    }else{
    }
    },err=>{
      this.loading.dismiss();     
    })
  }else{
    if(this.doctype == ''){
      this.componentProvider.presentToast("Please select document type.")
    }else if(this.idnumber == ''){
      this.componentProvider.presentToast("Please enter document number")
    }else if(this.imageUpload == ''){
      this.componentProvider.presentToast("Please add document image")
    }
    else if(this.country == ''){
      this.componentProvider.presentToast("Please fill country ")
    }
    else if(this.state == ''){
      this.componentProvider.presentToast("Please fill state")
    }
    else if(this.expdate == ''){
      this.componentProvider.presentToast("Please select Expiry date")
    }
    else if(this.issueDate == ''){
      this.componentProvider.presentToast("Please select Issue date")
    }
   }
  }
  view(){
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd=new FormData();
    fd.append('user_token',this.userData.token),
    this.api.post('view_doc.php',fd).subscribe((res:any)=>{
    console.log(res);
    this.loading.dismiss();
    this.componentProvider.presentToast(res.message)
    if(res.status=='Success'){     
      this.imageUpload=res.data.docimage;
      this.doctype=res.data.idtype;
      this.idnumber=res.data.idnumber;
    }else{
    }
    },err=>{
      this.loading.dismiss();     
    })
 
  }
}
