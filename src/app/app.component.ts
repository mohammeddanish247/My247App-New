import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, MenuController, ModalController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { IProducts } from './interface/products';
import { ApiService } from './services/api.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{

  @ViewChild('title') title:ElementRef;
  @ViewChild('email') email:ElementRef;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList < IonRouterOutlet > ;

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  pages = [
    {
      name: "Home",
      path: "home",
      icon: "home-outline"
    },
    {
      name: "Dashboard",
      path: "dashboard",
      icon: "apps-outline"
    },
    {
      name: "Log a claim",
      path: "log-claim",
      icon: "newspaper-outline",
      productValue: null
    },
    {
      name: "Track my claims",
      path: "track-claim",
      icon: "analytics-outline",
      productValue: null
    },
    {
      name: "Contact Us",
      path: "contact",
      icon: "send-outline",
    },
    {
      name: "24x7 Support",
      path: "support",
      icon: "headset-outline",
    },
    {
      name: "Terms & Conditions",
      path: "terms-and-conditions",
      icon: "document-text-outline",
    },
    {
      name: "Card",
      path: "card",
      icon: "document-text-outline",
    },
  ];
  
  flag = true;
  userData = {         
    Eligibility: false,
    Name : "",
    Email : "",
    ParentID: "",
    UserID: "",
    LoginAccess : false,
    cref : "",
    surname : ""};

  constructor(
    public platform : Platform,
    public router : Router,
    public menuCtrl : MenuController,
    public api : ApiService,
    public storage : Storage,
    private alert : AlertController,
    public network : Network,
    private location : Location
    ) {
      this.initializeApp();
    }

  async ngOnInit() {
    await this.storage.create();
    // console.log("danish"+this.userData);
    
  }

  initializeApp() {
    console.log("Inbside inisiallized apps");
  //  this.network.onDisconnect().subscribe(() => {
  //     console.log('network was disconnected :-(');
  //     this.router.navigate(['no-internet']);
  //   });
    this.platform.backButton.subscribeWithPriority(0, () => {
      // console.log("Danish"+ this.router.url);
      if(this.router.url != '/no-internet'){
        this.router.navigate(['dashboard']);
      }
    });
  }

  navToPage(p){
    console.log(`navigating to ${p.path}`);
    if(p.path == "log-claim" || p.path == "track-claim"){
      this.router.navigate([`risk-addresses`],{
        state : p
      });
    }else{
      this.router.navigate([`${p.path}`],{
        state : p
      });
    }
  }


  ionWillOpen(){
      this.storage.get("Userdata").then(res=>{
        console.log(JSON.stringify(res));
        if (res != null || res != "null") {             
          this.userData = res;
          console.log("storage "+this.userData.Name);    
          this.title.nativeElement.innerText = this.camelize(this.userData.Name.toLowerCase());
          this.email.nativeElement.innerText = this.userData.Email.toLowerCase();
        }
      }).catch(err=>{
        console.log("error :"+err);
      })
  }

camelize(str) {
  let name: string= "";
  str = str.split(" ");
  console.log(str.length);
  str.forEach(element => {
    name = name + " "+element.charAt(0).toUpperCase()+element.slice(1)
    console.log(name);
  });
  return name;
}

async logout(){
  this.menuCtrl.close();
  let alert = await this.alert.create({
    // message : "Do You want to log out",
    message : `<img src="../../../assets/imgs/logout.gif"><br>`,
    header : "Are You Sure?",
    subHeader: "Do you want to exit?",
    buttons: [{text : "Cancel"} , {text : "LogOut", handler : ()=>{
        this.api.logout();
    }}],

  });
  alert.present();
}

addphoto(){
  console.log(this.network.type);
  console.log(this.network.downlinkMax);
  this.network.onChange().subscribe(res=>{
    this.api.presentToast(" Danish "+res)
  })
  this.api.presentToast(""+this.network.downlinkMax+" "+this.network.type);
}



}

