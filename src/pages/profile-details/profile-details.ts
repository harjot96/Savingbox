import { Component, NgZone } from "@angular/core";
import { IonicPage, ActionSheetController,NavController, NavParams, Events,LoadingController } from "ionic-angular";
import { MyProfilePage } from "../my-profile/my-profile";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Api } from '../../providers';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ComponentProvider } from "../../providers/component/component";
import { TabsPage } from '../tabs/tabs';
import { UploaddocsPage } from '../uploaddocs/uploaddocs';
import * as moment from 'moment';
declare var google: any;
declare var $: any;
/**
 * Generated class for the ProfileDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-profile-details",
  templateUrl: "profile-details.html",
})
export class ProfileDetailsPage {
  public profileForm: FormGroup;
  loading: any;
  userData: any = "";
  autocompleteItems;
  autocomplete;
  latitude: number = 0;
  longitude: number = 0;
  geo: any;
  code="1";
  paisCode = [

    {
      pais: "South Africa",
      code: "504",
      img:'assets/imgs/india.svg'
    },
    {
      pais: "USA",
      code: "1",
      img:'assets/imgs/india.svg'

    },
    {
      pais: "India",
      code: "91",
      img:'assets/imgs/india.svg'

    }
  ]
  countryCode=[
    {
        "country": "Afghanistan",
        "abbreviation": "AF"
    },
    {
        "country": "Albania",
        "abbreviation": "AL"
    },
    {
        "country": "Algeria",
        "abbreviation": "DZ"
    },
    {
        "country": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "country": "Andorra",
        "abbreviation": "AD"
    },
    {
        "country": "Angola",
        "abbreviation": "AO"
    },
    {
        "country": "Anguilla",
        "abbreviation": "AI"
    },
    {
        "country": "Antarctica",
        "abbreviation": "AQ"
    },
    {
        "country": "Antigua and Barbuda",
        "abbreviation": "AG"
    },
    {
        "country": "Argentina",
        "abbreviation": "AR"
    },
    {
        "country": "Armenia",
        "abbreviation": "AM"
    },
    {
        "country": "Aruba",
        "abbreviation": "AW"
    },
    {
        "country": "Australia",
        "abbreviation": "AU"
    },
    {
        "country": "Austria",
        "abbreviation": "AT"
    },
    {
        "country": "Azerbaijan",
        "abbreviation": "AZ"
    },
    {
        "country": "Bahamas",
        "abbreviation": "BS"
    },
    {
        "country": "Bahrain",
        "abbreviation": "BH"
    },
    {
        "country": "Bangladesh",
        "abbreviation": "BD"
    },
    {
        "country": "Barbados",
        "abbreviation": "BB"
    },
    {
        "country": "Belarus",
        "abbreviation": "BY"
    },
    {
        "country": "Belgium",
        "abbreviation": "BE"
    },
    {
        "country": "Belize",
        "abbreviation": "BZ"
    },
    {
        "country": "Benin",
        "abbreviation": "BJ"
    },
    {
        "country": "Bermuda",
        "abbreviation": "BM"
    },
    {
        "country": "Bhutan",
        "abbreviation": "BT"
    },
    {
        "country": "Bolivia",
        "abbreviation": "BO"
    },
    {
        "country": "Bosnia and Herzegovina",
        "abbreviation": "BA"
    },
    {
        "country": "Botswana",
        "abbreviation": "BW"
    },
    {
        "country": "Bouvet Island",
        "abbreviation": "BV"
    },
    {
        "country": "Brazil",
        "abbreviation": "BR"
    },
    {
        "country": "British Indian Ocean Territory",
        "abbreviation": "IO"
    },
    {
        "country": "Brunei",
        "abbreviation": "BN"
    },
    {
        "country": "Bulgaria",
        "abbreviation": "BG"
    },
    {
        "country": "Burkina Faso",
        "abbreviation": "BF"
    },
    {
        "country": "Burundi",
        "abbreviation": "BI"
    },
    {
        "country": "Cambodia",
        "abbreviation": "KH"
    },
    {
        "country": "Cameroon",
        "abbreviation": "CM"
    },
    {
        "country": "Canada",
        "abbreviation": "CA"
    },
    {
        "country": "Cape Verde",
        "abbreviation": "CV"
    },
    {
        "country": "Cayman Islands",
        "abbreviation": "KY"
    },
    {
        "country": "Central African Republic",
        "abbreviation": "CF"
    },
    {
        "country": "Chad",
        "abbreviation": "TD"
    },
    {
        "country": "Chile",
        "abbreviation": "CL"
    },
    {
        "country": "China",
        "abbreviation": "CN"
    },
    {
        "country": "Christmas Island",
        "abbreviation": "CX"
    },
    {
        "country": "Cocos (Keeling) Islands",
        "abbreviation": "CC"
    },
    {
        "country": "Colombia",
        "abbreviation": "CO"
    },
    {
        "country": "Comoros",
        "abbreviation": "KM"
    },
    {
        "country": "Congo",
        "abbreviation": "CG"
    },
    {
        "country": "Cook Islands",
        "abbreviation": "CK"
    },
    {
        "country": "Costa Rica",
        "abbreviation": "CR"
    },
    {
        "country": "Croatia",
        "abbreviation": "HR"
    },
    {
        "country": "Cuba",
        "abbreviation": "CU"
    },
    {
        "country": "Cyprus",
        "abbreviation": "CY"
    },
    {
        "country": "Czech Republic",
        "abbreviation": "CZ"
    },
    {
        "country": "Denmark",
        "abbreviation": "DK"
    },
    {
        "country": "Djibouti",
        "abbreviation": "DJ"
    },
    {
        "country": "Dominica",
        "abbreviation": "DM"
    },
    {
        "country": "Dominican Republic",
        "abbreviation": "DO"
    },
    {
        "country": "East Timor",
        "abbreviation": "TP"
    },
    {
        "country": "Ecuador",
        "abbreviation": "EC"
    },
    {
        "country": "Egypt",
        "abbreviation": "EG"
    },
    {
        "country": "El Salvador",
        "abbreviation": "SV"
    },
    {
        "country": "Equatorial Guinea",
        "abbreviation": "GQ"
    },
    {
        "country": "Eritrea",
        "abbreviation": "ER"
    },
    {
        "country": "Estonia",
        "abbreviation": "EE"
    },
    {
        "country": "Ethiopia",
        "abbreviation": "ET"
    },
    {
        "country": "Falkland Islands",
        "abbreviation": "FK"
    },
    {
        "country": "Faroe Islands",
        "abbreviation": "FO"
    },
    {
        "country": "Fiji Islands",
        "abbreviation": "FJ"
    },
    {
        "country": "Finland",
        "abbreviation": "FI"
    },
    {
        "country": "France",
        "abbreviation": "FR"
    },
    {
        "country": "French Guiana",
        "abbreviation": "GF"
    },
    {
        "country": "French Polynesia",
        "abbreviation": "PF"
    },
    {
        "country": "French Southern territories",
        "abbreviation": "TF"
    },
    {
        "country": "Gabon",
        "abbreviation": "GA"
    },
    {
        "country": "Gambia",
        "abbreviation": "GM"
    },
    {
        "country": "Georgia",
        "abbreviation": "GE"
    },
    {
        "country": "Germany",
        "abbreviation": "DE"
    },
    {
        "country": "Ghana",
        "abbreviation": "GH"
    },
    {
        "country": "Gibraltar",
        "abbreviation": "GI"
    },
    {
        "country": "Greece",
        "abbreviation": "GR"
    },
    {
        "country": "Greenland",
        "abbreviation": "GL"
    },
    {
        "country": "Grenada",
        "abbreviation": "GD"
    },
    {
        "country": "Guadeloupe",
        "abbreviation": "GP"
    },
    {
        "country": "Guam",
        "abbreviation": "GU"
    },
    {
        "country": "Guatemala",
        "abbreviation": "GT"
    },
    {
        "country": "Guernsey",
        "abbreviation": "GG"
    },
    {
        "country": "Guinea",
        "abbreviation": "GN"
    },
    {
        "country": "Guinea-Bissau",
        "abbreviation": "GW"
    },
    {
        "country": "Guyana",
        "abbreviation": "GY"
    },
    {
        "country": "Haiti",
        "abbreviation": "HT"
    },
    {
        "country": "Heard Island and McDonald Islands",
        "abbreviation": "HM"
    },
    {
        "country": "Holy See (Vatican City State)",
        "abbreviation": "VA"
    },
    {
        "country": "Honduras",
        "abbreviation": "HN"
    },
    {
        "country": "Hong Kong",
        "abbreviation": "HK"
    },
    {
        "country": "Hungary",
        "abbreviation": "HU"
    },
    {
        "country": "Iceland",
        "abbreviation": "IS"
    },
    {
        "country": "India",
        "abbreviation": "IN"
    },
    {
        "country": "Indonesia",
        "abbreviation": "ID"
    },
    {
        "country": "Iran",
        "abbreviation": "IR"
    },
    {
        "country": "Iraq",
        "abbreviation": "IQ"
    },
    {
        "country": "Ireland",
        "abbreviation": "IE"
    },
    {
        "country": "Isle of Man",
        "abbreviation": "IM"
    },
    {
        "country": "Israel",
        "abbreviation": "IL"
    },
    {
        "country": "Italy",
        "abbreviation": "IT"
    },
    {
        "country": "Ivory Coast",
        "abbreviation": "CI"
    },
    {
        "country": "Jamaica",
        "abbreviation": "JM"
    },
    {
        "country": "Japan",
        "abbreviation": "JP"
    },
    {
        "country": "Jersey",
        "abbreviation": "JE"
    },
    {
        "country": "Jordan",
        "abbreviation": "JO"
    },
    {
        "country": "Kazakhstan",
        "abbreviation": "KZ"
    },
    {
        "country": "Kenya",
        "abbreviation": "KE"
    },
    {
        "country": "Kiribati",
        "abbreviation": "KI"
    },
    {
        "country": "Kuwait",
        "abbreviation": "KW"
    },
    {
        "country": "Kyrgyzstan",
        "abbreviation": "KG"
    },
    {
        "country": "Laos",
        "abbreviation": "LA"
    },
    {
        "country": "Latvia",
        "abbreviation": "LV"
    },
    {
        "country": "Lebanon",
        "abbreviation": "LB"
    },
    {
        "country": "Lesotho",
        "abbreviation": "LS"
    },
    {
        "country": "Liberia",
        "abbreviation": "LR"
    },
    {
        "country": "Libyan Arab Jamahiriya",
        "abbreviation": "LY"
    },
    {
        "country": "Liechtenstein",
        "abbreviation": "LI"
    },
    {
        "country": "Lithuania",
        "abbreviation": "LT"
    },
    {
        "country": "Luxembourg",
        "abbreviation": "LU"
    },
    {
        "country": "Macao",
        "abbreviation": "MO"
    },
    {
        "country": "North Macedonia",
        "abbreviation": "MK"
    },
    {
        "country": "Madagascar",
        "abbreviation": "MG"
    },
    {
        "country": "Malawi",
        "abbreviation": "MW"
    },
    {
        "country": "Malaysia",
        "abbreviation": "MY"
    },
    {
        "country": "Maldives",
        "abbreviation": "MV"
    },
    {
        "country": "Mali",
        "abbreviation": "ML"
    },
    {
        "country": "Malta",
        "abbreviation": "MT"
    },
    {
        "country": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "country": "Martinique",
        "abbreviation": "MQ"
    },
    {
        "country": "Mauritania",
        "abbreviation": "MR"
    },
    {
        "country": "Mauritius",
        "abbreviation": "MU"
    },
    {
        "country": "Mayotte",
        "abbreviation": "YT"
    },
    {
        "country": "Mexico",
        "abbreviation": "MX"
    },
    {
        "country": "Micronesia, Federated States of",
        "abbreviation": "FM"
    },
    {
        "country": "Moldova",
        "abbreviation": "MD"
    },
    {
        "country": "Monaco",
        "abbreviation": "MC"
    },
    {
        "country": "Mongolia",
        "abbreviation": "MN"
    },
    {
        "country": "Montenegro",
        "abbreviation": "ME"
    },
    {
        "country": "Montserrat",
        "abbreviation": "MS"
    },
    {
        "country": "Morocco",
        "abbreviation": "MA"
    },
    {
        "country": "Mozambique",
        "abbreviation": "MZ"
    },
    {
        "country": "Myanmar",
        "abbreviation": "MM"
    },
    {
        "country": "Namibia",
        "abbreviation": "NA"
    },
    {
        "country": "Nauru",
        "abbreviation": "NR"
    },
    {
        "country": "Nepal",
        "abbreviation": "NP"
    },
    {
        "country": "Netherlands",
        "abbreviation": "NL"
    },
    {
        "country": "Netherlands Antilles",
        "abbreviation": "AN"
    },
    {
        "country": "New Caledonia",
        "abbreviation": "NC"
    },
    {
        "country": "New Zealand",
        "abbreviation": "NZ"
    },
    {
        "country": "Nicaragua",
        "abbreviation": "NI"
    },
    {
        "country": "Niger",
        "abbreviation": "NE"
    },
    {
        "country": "Nigeria",
        "abbreviation": "NG"
    },
    {
        "country": "Niue",
        "abbreviation": "NU"
    },
    {
        "country": "Norfolk Island",
        "abbreviation": "NF"
    },
    {
        "country": "North Korea",
        "abbreviation": "KP"
    },
    {
        "country": "Northern Ireland",
        "abbreviation": "GB"
    },
    {
        "country": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "country": "Norway",
        "abbreviation": "NO"
    },
    {
        "country": "Oman",
        "abbreviation": "OM"
    },
    {
        "country": "Pakistan",
        "abbreviation": "PK"
    },
    {
        "country": "Palau",
        "abbreviation": "PW"
    },
    {
        "country": "Palestine",
        "abbreviation": "PS"
    },
    {
        "country": "Panama",
        "abbreviation": "PA"
    },
    {
        "country": "Papua New Guinea",
        "abbreviation": "PG"
    },
    {
        "country": "Paraguay",
        "abbreviation": "PY"
    },
    {
        "country": "Peru",
        "abbreviation": "PE"
    },
    {
        "country": "Philippines",
        "abbreviation": "PH"
    },
    {
        "country": "Pitcairn",
        "abbreviation": "PN"
    },
    {
        "country": "Poland",
        "abbreviation": "PL"
    },
    {
        "country": "Portugal",
        "abbreviation": "PT"
    },
    {
        "country": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "country": "Qatar",
        "abbreviation": "QA"
    },
    {
        "country": "Reunion",
        "abbreviation": "RE"
    },
    {
        "country": "Romania",
        "abbreviation": "RO"
    },
    {
        "country": "Russian Federation",
        "abbreviation": "RU"
    },
    {
        "country": "Rwanda",
        "abbreviation": "RW"
    },
    {
        "country": "Saint Helena",
        "abbreviation": "SH"
    },
    {
        "country": "Saint Kitts and Nevis",
        "abbreviation": "KN"
    },
    {
        "country": "Saint Lucia",
        "abbreviation": "LC"
    },
    {
        "country": "Saint Pierre and Miquelon",
        "abbreviation": "PM"
    },
    {
        "country": "Saint Vincent and the Grenadines",
        "abbreviation": "VC"
    },
    {
        "country": "Samoa",
        "abbreviation": "WS"
    },
    {
        "country": "San Marino",
        "abbreviation": "SM"
    },
    {
        "country": "Sao Tome and Principe",
        "abbreviation": "ST"
    },
    {
        "country": "Saudi Arabia",
        "abbreviation": "SA"
    },
    {
        "country": "Senegal",
        "abbreviation": "SN"
    },
    {
        "country": "Serbia",
        "abbreviation": "RS"
    },
    {
        "country": "Seychelles",
        "abbreviation": "SC"
    },
    {
        "country": "Sierra Leone",
        "abbreviation": "SL"
    },
    {
        "country": "Singapore",
        "abbreviation": "SG"
    },
    {
        "country": "Slovakia",
        "abbreviation": "SK"
    },
    {
        "country": "Slovenia",
        "abbreviation": "SI"
    },
    {
        "country": "Solomon Islands",
        "abbreviation": "SB"
    },
    {
        "country": "Somalia",
        "abbreviation": "SO"
    },
    {
        "country": "South Africa",
        "abbreviation": "ZA"
    },
    {
        "country": "South Georgia and the South Sandwich Islands",
        "abbreviation": "GS"
    },
    {
        "country": "South Korea",
        "abbreviation": "KR"
    },
    {
        "country": "South Sudan",
        "abbreviation": "SS"
    },
    {
        "country": "Spain",
        "abbreviation": "ES"
    },
    {
        "country": "Sri Lanka",
        "abbreviation": "LK"
    },
    {
        "country": "Sudan",
        "abbreviation": "SD"
    },
    {
        "country": "Suriname",
        "abbreviation": "SR"
    },
    {
        "country": "Svalbard and Jan Mayen",
        "abbreviation": "SJ"
    },
    {
        "country": "Swaziland",
        "abbreviation": "SZ"
    },
    {
        "country": "Sweden",
        "abbreviation": "SE"
    },
    {
        "country": "Switzerland",
        "abbreviation": "CH"
    },
    {
        "country": "Syria",
        "abbreviation": "SY"
    },
    {
        "country": "Tajikistan",
        "abbreviation": "TJ"
    },
    {
        "country": "Tanzania",
        "abbreviation": "TZ"
    },
    {
        "country": "Thailand",
        "abbreviation": "TH"
    },
    {
        "country": "The Democratic Republic of Congo",
        "abbreviation": "CD"
    },
    {
        "country": "Timor-Leste",
        "abbreviation": "TL"
    },
    {
        "country": "Togo",
        "abbreviation": "TG"
    },
    {
        "country": "Tokelau",
        "abbreviation": "TK"
    },
    {
        "country": "Tonga",
        "abbreviation": "TO"
    },
    {
        "country": "Trinidad and Tobago",
        "abbreviation": "TT"
    },
    {
        "country": "Tunisia",
        "abbreviation": "TN"
    },
    {
        "country": "Turkey",
        "abbreviation": "TR"
    },
    {
        "country": "Turkmenistan",
        "abbreviation": "TM"
    },
    {
        "country": "Turks and Caicos Islands",
        "abbreviation": "TC"
    },
    {
        "country": "Tuvalu",
        "abbreviation": "TV"
    },
    {
        "country": "Uganda",
        "abbreviation": "UG"
    },
    {
        "country": "Ukraine",
        "abbreviation": "UA"
    },
    {
        "country": "United Arab Emirates",
        "abbreviation": "AE"
    },
    {
        "country": "United Kingdom",
        "abbreviation": "GB"
    },
    {
        "country": "United States",
        "abbreviation": "US"
    },
    {
        "country": "United States Minor Outlying Islands",
        "abbreviation": "UM"
    },
    {
        "country": "Uruguay",
        "abbreviation": "UY"
    },
    {
        "country": "Uzbekistan",
        "abbreviation": "UZ"
    },
    {
        "country": "Vanuatu",
        "abbreviation": "VU"
    },
    {
        "country": "Venezuela",
        "abbreviation": "VE"
    },
    {
        "country": "Vietnam",
        "abbreviation": "VN"
    },
    {
        "country": "Virgin Islands, British",
        "abbreviation": "VG"
    },
    {
        "country": "Virgin Islands, U.S.",
        "abbreviation": "VI"
    },
    {
        "country": "Wallis and Futuna",
        "abbreviation": "WF"
    },
    {
        "country": "Western Sahara",
        "abbreviation": "EH"
    },
    {
        "country": "Yemen",
        "abbreviation": "YE"
    },
    {
        "country": "Zambia",
        "abbreviation": "ZM"
    },
    {
        "country": "Zimbabwe",
        "abbreviation": "ZW"
    }
]
  imageUpload:any='';
  profile_status:any='';
  imagestatus:any=0;
  service = new google.maps.places.AutocompleteService();
  constructor(   
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    public zone: NgZone,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public loadingController:LoadingController,
    public api:Api,
    public componentProvider:ComponentProvider
  ) {
    this.profile_status = navParams.get('profileStatus');
    this.profileForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required])],
      name: ["", Validators.compose([Validators.required])],
      gender: ["", Validators.compose([Validators.required])],
      dob:  ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      phone: ["", Validators.compose([Validators.required])],
      country: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      postalcode: ["", Validators.compose([Validators.required])],
      state: ["", Validators.compose([Validators.required])],


      // dailcode: [''],
      profile_image:[""]
    });
    this.autocompleteItems = [];
    this.autocomplete = {
      query: "",
    };
    console.log(navParams.get('profileStatus'));
    if(navParams.get('profileStatus') =="0"){
      this.userData = JSON.parse(localStorage.getItem("registeredData"));
    }else{
      this.userData = JSON.parse(localStorage.getItem("userData"));     
    }
    console.log(this.userData)
    if(this.userData.profile_image  && this.userData.profile_image != null){ 
      this.imageUpload = this.userData.profile_image;
      }else{
      this.imageUpload = '';

      }
      console.log(this.userData, "userData", this.imageUpload);

    this.events.subscribe("user:created", (data: any) => {
      this.userProfile();
    });

    // this.profilePhoto = j
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ProfileDetailsPage");
  }
  uploadDocs() {
    this.navCtrl.push(UploaddocsPage);
  }
  ngOnInit() {
    // debugger
    // $('.accordion__answer:first').show();
    // $('.accordion__question:first').addClass('expanded');
    // setTimeout(() => {
    //   $('#signin-mobileno').intlTelInput({
    //     hiddenInput: "phone-no",
    //     initialCountry: "gb",
    //     utilsScript: "assets/js/utils.js"
    //   });
    // }, 200);
    this.profileForm.patchValue({
      name: this.userData.name,
      email: this.userData.email,
      gender: this.userData.gender,
      dob: this.userData.date_of_birth,
      address: this.userData.location,
      phone: this.userData.mobile,
      country:this.userData.country,
      city:this.userData.city,
      postalcode:this.userData.postalcode,
      state:this.userData.postalcode,


      // profile_image:this.userData.profile_image
    });
    console.log(this.profileForm.controls.dob);
    if(this.userData.dial_code){
      this.code = this.userData.dial_code;
    }
    
 
  }
  goBack() {
    this.navCtrl.push(MyProfilePage);
    // this.navCtrl.goBack('/pageA');
    // this.navCtrl.popTo(MyProfilePage);
  }
  userProfile(){
    // this.userData = JSON.parse(localStorage.getItem("userData"));
    console.log(this.userData)
    let fd=new FormData();
    fd.append('user_token',this.userData.token),
   this.api.post('view_profile.php',fd).subscribe((res:any)=>{
    console.log(res);
    if(res.status=='Success'){
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.userData = JSON.parse(localStorage.getItem('userData'));
      if(this.userData.profile_image != 'undefined' && this.userData.profile_image){
        this.imageUpload = this.userData.profile_image;
        }else{
        this.imageUpload = '';
        }
    }else{
 
    }
    },err=>{
      })
  
   }
  chooseItem(item: any) {
    console.log(item);
    this.geo = item;
    this.geoCode(this.geo); //convert Address to lat and long
  }
  geoCode(address: any) {
    this.loading = this.loadingController.create({ content: "Logging in ,please wait..." });
    this.loading.present();
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      this.latitude = results[0].geometry.location.lat();
      this.longitude = results[0].geometry.location.lng();
      this.autocompleteItems = [];
      this.profileForm.controls.address.setValue(address);
      this.loading.dismiss();
    });
  }
  dismiss() {
    this.autocomplete = [];
    // this.viewCtrl.dismiss();
  }
  updateSearch() {
    console.log("enter");
    console.log(this.profileForm.value.address);
    if (this.profileForm.value.address == "") {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions(
      {
        input: this.profileForm.value.address,
      },
      (predictions, status) => {
        me.autocompleteItems = [];
        console.log(predictions);
        me.zone.run(() => {
          if (predictions != null) {
            predictions.forEach((prediction) => {
              me.autocompleteItems.push(prediction.description);
            });
            // this.autocomplete.query= predictions[0].description;
            console.log(me.autocompleteItems);
          }
        });
      }
    );
  }
  editProfile(){
    // var phone = document.getElementById("profile-mobileno");
    // var country = $(phone).intlTelInput("getSelectedCountryData").dialCode;
  
    this.loading = this.loadingController.create({ content: "Please wait..." });
    this.loading.present();
    let fd=new FormData();
    fd.append('name',this.profileForm.value.name),
    fd.append('user_token',this.userData.token),
    fd.append('email',this.profileForm.value.email),
    fd.append('mobile',this.profileForm.value.phone),
    fd.append('gender',this.profileForm.value.gender),
    fd.append('date_of_birth',this.profileForm.value.dob),
    fd.append('location',this.profileForm.value.address),
    fd.append('profile_image',this.imageUpload);
    fd.append('image_status',this.imagestatus);    
    fd.append('country',this.profileForm.value.country)
    fd.append('postalcode',this.profileForm.value.postalcode) 
    fd.append('city',this.profileForm.value.city) 
    fd.append('state',this.profileForm.value.state)

    this.api.post('edit_profile_confirm.php',fd).subscribe((res:any)=>{
    console.log(res);
    this.loading.dismiss();
    this.componentProvider.presentToast(res.message)
    if(res.status=='Success'){     
      // this.userData = JSON.parse(localStorage.getItem("registeredData"));
      // this.userProfile();
      // this.signinForm.reset();
      this.imagestatus=0;
      localStorage.setItem('userData', JSON.stringify(res.data));
      this.events.publish('user:created', Date.now());
      this.navCtrl.setRoot('TabsPage');     
    }else{

    }


    },err=>{
      this.loading.dismiss();
     
    })

  }
  openCamera(sourceType) {
    const options: CameraOptions = {
      quality: 30,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 300,
      targetHeight: 300,
      // encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: false,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageUpload = 'data:image/jpeg;base64,' + imageData;
      this.imagestatus = 1;
      this.componentProvider.presentToast("Please click update button to update profile picture");
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
}
