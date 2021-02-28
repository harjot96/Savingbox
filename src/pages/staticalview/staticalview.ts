import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { Api } from '../../providers';

/**
 * Generated class for the StaticalviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-staticalview',
  templateUrl: 'staticalview.html',
})
export class StaticalviewPage {
  gaugeType = "full";
 
  gaugeLabel = "Savings Box";
  gaugeAppendText = "";
  backgroundcolor='rgb(255,0,0)'
  data: any;
  min:number;
  max:number;
  gaugeValue:number;

  chartdata: any;
  constructor(public changeDetectorRef:ChangeDetectorRef,public events:Events,public navCtrl: NavController, public navParams: NavParams,public api:Api) {
  console.log(this.navParams.get('data'));
  this.data=this.navParams.get('data');  
  this.getCycelStatic();
  this.events.subscribe("pay:created", (data: any) => {
     this.getCycelStatic();
     this.changeDetectorRef.detectChanges();
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StaticalviewPage');
  }

  getCycelStatic()
  {
    let fd=new FormData();
    fd.append('user_token',JSON.parse(localStorage.getItem('userData')).token);
    fd.append('cycle_id',this.data.cycle_id)
    this.api.post('group_view.php',fd).subscribe((res:any)=>{
      console.log(res);
      this.chartdata=res.data;
      this.max=res.data.total_amount;
      this.gaugeValue=res.data.total_paid;      
    })
  }
  getPercenage(val)
  {
   
   
return (parseInt(val.total_paid)/parseInt(val.total_amount))*100
  }

}
