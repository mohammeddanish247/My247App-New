import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';
import { NavigationExtras, Router } from "@angular/router";
import { HttpClient, HttpParams } from "@angular/common/http"
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { IUserData } from '../interface/user-login';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, observable, Observable } from 'rxjs';

interface ClaimResponse {
  Outcome;
  OutcomeExplanation;
  ExcessDueToAge;
  Message;
  PaymentReason;
  PaymentReasonExplanation;
  PaymentToBeCollected;
  DisbursmentID;
  ClaimStatus;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  liveUrl = "https://247app-api.myvp.cloud/Service1.asmx";
  url_api = "https://webservices.home360.org.uk/Service1.asmx";
  url2 = "https://api2.home360.org.uk/service1.asmx";
  urlBeta = "http://beta-api3.247development.uk/service1.asmx"
  localUrl = "http://localhost:52600/Service1.asmx"
  url: string = "https://247app-api.myvp.cloud/Service1.asmx";

  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
  url_underwriting: string;

  constructor(
    private http : HttpClient,
    private alert : AlertController,
    private router : Router,
    private navCtrl : NavController,
    private storage : Storage,
    private loading : LoadingController,
    private toastController : ToastController
    ) {

   }


  async loadToken() {
    console.log("load token");    
    const token = await this.storage.get('TOKEN_KEY');
      if (token) {
        console.log('set token: ', token);
        this.token = token;
        this.isAuthenticated.next(true);
      } else {
        console.log("no token");
        this.isAuthenticated.next(false);
      }
  }


  async checkNetworkStatus() {
      const status = await (await Network.getStatus()).connected
      return status
  };


  // loginService(surname : string, cref : string){
  //   let params = new HttpParams()
  //   .set('cref', cref)
  //   .set('surname', surname)
  //   const loginRes = this.http.post(this.url_api+'LoginUserRefAndSurname',params);
  //   return loginRes
  // }



  httpSend (method : string, params : HttpParams, endPoint : string) {
      switch (method) {
        case "post":
          return this.http.post(this.url+"/"+endPoint,params);
        
        case "get":
          return this.http.get(this.url+"/"+endPoint);
      
        default:
          this.showAlertBox("you API method is name is not defined it should be either GET or POST")
          break;
      }
  }

  async showAlertBox(msg : string, hdr? : string , anim?){
    let alert = await this.alert.create({
      message : msg,
      header : hdr || "Alert !",
      buttons: ['Dismiss'],
      cssClass : "my-custom-class",

    });
    alert.present();
  }

  showAlertBoxWithAnimation(header : string, animfileName : string, msg :string) {
    return new Promise((resolve) => {
      this.alert.create({
          header: header,
          cssClass: "custom-class",
          message: `<img src="../../../assets/imgs/${animfileName}.gif"><br> ${msg}`,
          backdropDismiss: false,
          buttons: [
            {
              text: "Dismiss",
              handler: () => {
                resolve("");
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    });
  }

  async showAlertBoxWithButton(msg : string, hdr : string , btn_name : string){
    let alert = await this.alert.create({
      message : msg,
      header : hdr,
      buttons: ['Dismiss' , btn_name],
      cssClass : "my-custom-class",

    });
    alert.present();
  }

  loginAuthentication(cref:string,surname:string){
    return new Observable<IUserData>((observer)=>{
      let params = new HttpParams()
    .set("cref",cref) //"WS0052980"
    .set("surname",surname)
    .set("Source"," ")
    this.httpSend("post",params,"LoginUserRefAndSurname").subscribe(
    (data : IUserData)=>{ 
      if (data.LoginAccess) {
          this.isAuthenticated.next(true);
          let userdata : IUserData ;
          userdata = data ;
          userdata.cref = cref ;
          userdata.surname = surname;
          this.storage.set('TOKEN_KEY', userdata.UserID);
          this.storage.set('Userdata', userdata).then(() => {
            observer.next(userdata)  
            observer.complete();
            console.log("Data Stored");
          },
          error => console.error('Error storing item', error)
          );        
      } else {
        observer.error("Login Access Denied!");
        observer.complete();
        //observer.error(false); //uncomment this after live 

              //reomve this after live 
              // this.isAuthenticated.next(true);
              // let userdata : IUserData ;
              // userdata = {UserID:"e1e17421-5c67-4496-8595-76385a05852a",ParentID:null,Eligibility:false,Name:"Ranjen GOHRI", Email: "Ranjen@totalinsurance.uk.com",LoginAccess:true, cref : cref , surname : surname} ;
              // this.storage.set('TOKEN_KEY', userdata.UserID);
              // this.storage.set('Userdata', userdata).then(() => {
              //   observer.next(userdata)  
              //   observer.complete();
              //   console.log("Data Stored");
              // });        
              //remove this after live
              
      }    
    },
    (err)=>{
      observer.error("Login Access Denied!");
      observer.complete();
      // observer.error(false); //uncomment this after live 

                    //reomve this after live 
                    // this.isAuthenticated.next(true);
                    // let userdata : IUserData ;
                    // userdata = {UserID:"e1e17421-5c67-4496-8595-76385a05852a",ParentID:null,Eligibility:false,Name:"Ranjen GOHRI", Email: "Ranjen@totalinsurance.uk.com",LoginAccess:true, cref : cref , surname : surname} ;
                    // this.storage.set('TOKEN_KEY', userdata.UserID);
                    // this.storage.set('Userdata', userdata).then(() => {
                    //   observer.next(userdata)  
                    //   observer.complete();
                    //   console.log("Data Stored");
                    // });        
                    //remove this after live
                
    }
    )
    });    
  }

  logout() {
    this.isAuthenticated.next(false);
    this.storage.remove('TOKEN_KEY').then(res=>{
      console.log("rem "+res);
      this.router.navigate(['login']);
    })
  }

  async getuserid(){
    return await this.storage.get('TOKEN_KEY');
  }

  getRiskAddresses(productValue : number){
    return new Promise(async (resolve, reject) => {
      let LeadID = await this.getuserid().then(res=>{
        return res;
      })
      if (LeadID){
        let params = new HttpParams()
      .set("LeadID",LeadID) //"WS0052980"
      .set("MasterGroupID",productValue)
      this.httpSend("post",params,"GetRiskAddressesByLeadIDandGroupType").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
      }
      else{
        console.log("no lead id found");
        reject("no lead id found");
      }
    });
  }

  getProductsList(LeadID, productValue) {
    return new Promise(async (resolve, reject) => {
        let params = new HttpParams()
      .set("LeadID",LeadID) //"WS0052980"
      .set("MasterGroupID",productValue)
      this.httpSend("post",params,"GetProductsByLeadIDAndMasterGroup").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
      });
  }

  public getProducts(cref, userid) {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
      .set('cref',cref)
      .set('leadid',userid)
      this.httpSend('post',params,'GetProductsByRef').subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      })
    });
  }

  GetAllLivePoliciesByLead() {
    return new Promise(async (resolve, reject) => {
      let LeadID = await this.getuserid().then(res=>{
        return res;
      })
      let params = new HttpParams()
      .set("leadid",LeadID)
      this.httpSend("post",params,"GetAllLivePoliciesByLead").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
    });
  }

  public getEligibilityProducts(cref, leadid) {
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("cref",cref)
      .set("leadid",leadid)
      this.httpSend("post",params,"GetProductsForElgibilityByRef").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
    });
  }

  getEligibilityFields(productid,leadid){
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("productid",productid)
      .set("leadid",leadid)
      this.httpSend("post",params,"GetEligibilitiesByProduct").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
    });
  }

  public submitEligibility(data: any) {
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("json",JSON.stringify(data))
      this.httpSend("post",params,"SaveAnswersByQuoteEligibilityID").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
    });
  }

  hasService(productID) {
    let pid = parseInt(productID);
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("ProductID",pid)
      this.httpSend("post",params,"ProductHasService").subscribe(res=>{
        resolve(res);
      },
      err=>{
        reject(err)
      })
    });
  }
       
  public viewUserServiceContract() {
    this.storage.get("TOKEN_KEY").then(val => {
      this.getPolicyDocument(val).then((res)=>{
            console.log(res);
            this.navToDoc(res)
            },
            err => {
              // me.util.dismissLoader();
              // me.util.showToast("An error occurred", () => {
              //   console.log(err);
              // });
            },
          );
    }).catch(err=>{
      //me.util.dismissLoader();
    });
  }        
  
  public getPolicyDocument(val) {
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("leadid",val)
      this.httpSend("post",params,"GetServiceDocumentByLead").subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      })
    });
  }

  checkifETAorFutureService(cref: string) {
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("CRef",cref)
      this.httpSend("post",params,"CheckIfETAorFutreService").subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      })
    });
  }

  checkInceptionDateandServiceDueDate(cref: string) {
    return new Promise(async (resolve, reject) => {
      let params = new HttpParams()
      .set("lref",cref)
      this.httpSend("post",params,"CheckInceptionDateAndServiceDueDate").subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      })
    });
  }

  navToDoc(link) {
    window.open(
      `https://docs.google.com/viewer?url=${link}`,
      "_system",
      "location=yes",
    );
  }


  getMultiple(keys: string[]) {
    const promises = [];
    keys.forEach(key => promises.push(this.storage.get(key)));
    return Promise.all(promises).then(values => {
      const result = {};
      values.map((value, index) => {
        result[keys[index]] = value;
      });
      return result;
    });
  }

  getUserData(){
    return this.storage.get('Userdata');
  }

  getManufacturers() {
    return new Promise((resolve, reject) => {
      let params = new HttpParams();
      this.httpSend('get',params,'ListOfManufacturer').subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      });
    });
  }

  getProductsQs(Hr360ProductID) {
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
      .set("productID",Hr360ProductID)
      this.httpSend('post',params,'GetProductQsType_New_WithoutPreCheck').subscribe((res)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      });
    });
  }

  getClaimsbyCRef(cref){
    return new Promise(async (resolve, reject) => {
      if (cref) {
        let params = new HttpParams()
        .set("CRef",cref)
        this.httpSend('post',params,'TrackMyClaimsByCRefNew').subscribe((res:any)=>{
          resolve(res.ClaimDetail);
        },
        err=>{
          reject(err);
        });
      }
    });
  }

  sendprecheckAnswers(QsAns,HR360ProductID : string, cref : string){
    return new Promise(async (resolve, reject) => {
      if (cref) {
        let params = new HttpParams()
        .set("QsAns",QsAns)
        .set("HR360ProductID",HR360ProductID)
        .set("PolicyRef",cref)
        this.httpSend('post',params,'SaveGenericAnswers_New').subscribe((res:any)=>{
          resolve(res);
        },
        err=>{
          reject(err);
        });
      }
    });
  }
  //SaveProductAnswerReturnClaimDetailsForGenericQuestions

  // call for precheck + main questions
  sendClaimAnswersWithPrecheck(QsAns,HR360ProductID : string, cref : string, precheckAns){
    return new Promise(async (resolve, reject) => {
      let LeadID = await this.getuserid().then(res=>{
        return res;
      })
      if (LeadID) {
        let params = new HttpParams()
        .set("QsAns",QsAns)
        .set("ProductID",HR360ProductID)
        .set("PolicyRef",cref)
        .set("Source","3")
        .set("genericAnswers",precheckAns)
        .set("VulnerabilityID","3")
        .set("leadid",LeadID)
        this.httpSend('post',params,'SaveProductAnswerReturnClaimDetailsForGenericQuestions').subscribe((res:any)=>{
          resolve(res);
        },
        err=>{
          reject(err);
        });
      }
    });
  }

  sendServicesAnswers(QsAns,HR360ProductID : string, cref : string){
    return new Promise(async (resolve, reject) => {
        let params = new HttpParams()
        .set("QsAns",QsAns)
        .set("ProductID",HR360ProductID)
        .set("PolicyRef",cref)
        .set("Source","2")
        this.httpSend('post',params,'SaveProductAnswerReturnClaimDetails').subscribe((res:any)=>{
          resolve(res);
        },
        err=>{
          reject(err);
        });
      });
  }

  sendUnderwriting(claimId: any) {
    const source = 2; // from app
    return new Promise((resolve, reject) => {
      let params = new HttpParams()
      .set("ClaimID",claimId)
      .set("source",source)
      this.httpSend('post',params,"ProcessUnderwritingJson").subscribe((res:any)=>{
        resolve(res);
      },
      err=>{
        reject(err);
      });
    });
  }


  async presentLoading(msg) {
    const loading = await this.loading.create({
      spinner: 'circles',
      message: msg,
    });
    return await loading.present();
  }

  dismissLoading(){
    this.loading.dismiss();
  }
  

  PresentAlert(msg: string, hdr?: string) {
    return new Promise((resolve) => {
      this.alert
        .create({
          header: hdr || "Alert Message",
          cssClass: "custom-class",
          subHeader: msg,
          backdropDismiss: false,
          buttons: [
            {
              text: "OK",
              handler: () => {
                resolve("");
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    });
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
}
