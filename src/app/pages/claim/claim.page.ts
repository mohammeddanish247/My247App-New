import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, IonModal, IonContent, IonSlides, AlertController} from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IPrecheck } from 'src/app/interface/IPrecheck';

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

@Component({
  selector: 'app-claim',
  templateUrl: './claim.page.html',
  styleUrls: ['./claim.page.scss'],
})
export class ClaimPage implements OnInit {

  @ViewChild('option1',{static: true}) op1: ElementRef;
  @ViewChild('option2',{static: true}) op2: ElementRef;
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  @ViewChild(IonSlides, { static: false }) ionSlides: IonSlides;

  
  product: any;
  manufacturers: unknown;
  data : any;
  questions : any[] ;
  precheckQs : any[];
  qCount: number = 0;
  s: any;

  claimForm =new FormGroup({})

  public slides: string[];
  public currentSlide: string;
  public isBeginning: boolean = true;
  public isEnd: boolean = false;
  public isFinalEnd: boolean = false;

  public slidesOpts = {
    allowTouchMove: false,
    autoHeight: true,
  };
  noQuestionFlag: boolean = false;
  precheckAnsArray: any[] = [];
  isprecheckDone: boolean = false;
  skeltonFlag: boolean = false;
  precheckSubmitedAns: string;

  constructor(private router:Router,
     private alert : AlertController,
     private auth: ApiService,
     public formBuilder: FormBuilder,
     public modalCtrl: ModalController, private rendere: Renderer2, private el:ElementRef) {

      this.product = this.router.getCurrentNavigation().extras.state;
      console.log(this.product);
      }

  ngOnInit() {
    console.log("inside claim page");
    this.getdata();
  }

  // Do You Realy want to make a Claim
  // Can We Fix it Before we make a Claim
  // Can we Fix it togather.
  
  getdata() {
    this.auth.getManufacturers().then(
      res => {
        this.manufacturers = res;
        console.log(res);
        this.auth.getProductsQs(this.product.Hr360ProductID).then(res=>{
          console.log(res);
          this.data = res
          this.skeltonFlag = true;
          this.showQuestions();
        }, reject => {
          console.log(reject);
        });
      },
      reject => {
        console.log(reject);
      });
  }

  showQuestions() {
    if (this.data.HasPrecheckQuestion && this.data.PrecheckQuestions.length) {
      this.questions = this.data.PrecheckQuestions;
      console.log(this.questions);
      this.s = this.questions[this.qCount];
      this.questions.forEach(element => {
        this.claimForm.addControl(element.ID,new FormControl("",Validators.required))
      });
    }else if(this.data.Questions && this.data.Questions.length){
      this.questions = this.data.Questions;
      console.log(this.questions);
      this.s = this.questions[this.qCount];
      this.questions.forEach(element => {
        this.claimForm.addControl(element.ID,new FormControl("",Validators.required))
      });
    }else{
      this.noQuestionFlag = true;
    }
  }

onNextButtonTouched(){
    if (this.claimForm.get(""+this.s.ID).invalid) {
      this.auth.showAlertBoxWithAnimation("Alert !","alert","Please provide appropriate answer.");
    } else {
      ++this.qCount;
      this.s = this.questions[this.qCount];
      document.getElementById('bubble').classList.remove("animate__bounceIn");
      setTimeout(()=>{
      document.getElementById('bubble').classList.add("animate__bounceIn");
      },0)
      this.ionSlides.slideNext();
      console.log("dddd "+JSON.stringify(this.claimForm.invalid)); 
    }
}

onBackButtonTouched(){
  --this.qCount;
  this.s = this.questions[this.qCount];
  document.getElementById('bubble').classList.remove("animate__bounceIn");
  setTimeout(()=>{
  document.getElementById('bubble').classList.add("animate__bounceIn");
  },0)
  this.ionSlides.slidePrev();
}

onSubmitTouched(){
  if (this.claimForm.get(""+this.s.ID).invalid) {
    this.auth.showAlertBoxWithAnimation("Alert !","alert","Please provide appropriate answer.");
  } else {
    this.qCount = 0;
    this.isprecheckDone = true
    // this.showAlert();
    console.log(this.data.HasPrecheckQuestion);
    if (!this.data.HasPrecheckQuestion) {
      this.sendClaim();
    } else {
      this.showAlert();
    }
  }

}

onFinalSubmitTouched(){
  if (this.claimForm.get(""+this.s.ID).invalid) {
    this.auth.showAlertBoxWithAnimation("Alert !","alert","Please provide appropriate answer.");
  } else {
    this.submitFinalClaim();
  }

}

submitFinalClaim() {
  this.sendClaim();
}

onSlidesDidChange(){

}

async onSlidesChanged() {
  const index = await this.ionSlides.getActiveIndex();
  if(this.isprecheckDone){
    this.isBeginning = await this.ionSlides.isBeginning();
    console.log(this.isBeginning);
    this.isFinalEnd = await this.ionSlides.isEnd();
    console.log("inside mainQues"+this.isFinalEnd);
  }else{
    this.isBeginning = await this.ionSlides.isBeginning();
    console.log(this.isBeginning);
    this.isEnd = await this.ionSlides.isEnd();
    console.log("inside precheck  "+this.isEnd);
  }
  
}

  onClickRadio(value){
    console.log(value);
  }

  showAlert() {
    return new Promise((resolve) => {
      this.alert.create({
          header: "Please Confirm.",
          cssClass: "custom-class",
          message: `<img src="../../../assets/imgs/solve.gif"><br> Does this solve your problem ?`,
          backdropDismiss: false,
          buttons: [
            {
              text: "No",
              handler: () => {
                this.isEnd = false;
                this.ShowClaimQuestions();
              },
            },
            {
              text: "Yes",
              handler: () => {
                this.sendClaim();
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    });
  }
  

  sendClaim() {
    this.auth.presentLoading('Please waite...');
    this.precheckAnsArray= [];
    for (let i = 0; i < Object.keys(this.claimForm.value).length; i++) {
      let precheckAns = new IPrecheck;
      precheckAns.ClaimID = "00000000-0000-0000-0000-000000000000"
      precheckAns.Answer = Object.values(this.claimForm.value)[i];
      precheckAns.QuestionID = Object.keys(this.claimForm.value)[i];
      this.precheckAnsArray.push(precheckAns);
    }
    this.auth.getMultiple(['cref']).then((res: any)=>{
      if(this.isFinalEnd){ // full claim with precheck
        this.auth.sendClaimAnswersWithPrecheck(JSON.stringify(this.precheckAnsArray),this.product.Hr360ProductID,res.cref,this.precheckSubmitedAns).then((res:any)=>{
          this.processResponce(res)
        }).catch(err=>{
          this.auth.dismissLoading();
          this.auth.showAlertBoxWithAnimation("Claim Declained !","alert",`${err.message}`);
        })
      }else{
        if (this.data.HasPrecheckQuestion) { //only pre check
          this.precheckSubmitedAns = JSON.stringify(this.precheckAnsArray);
          this.auth.sendprecheckAnswers(this.precheckSubmitedAns,this.product.Hr360ProductID,res.cref).then((res:any)=>{
            this.processResponce(res);
          }).catch(err=>{
            this.auth.dismissLoading();
            this.auth.showAlertBoxWithAnimation("Claim Declained !","alert",`${err.message}`);
          })
        } else { // other claim without precheck
          this.auth.sendServicesAnswers(JSON.stringify(this.precheckAnsArray),this.product.Hr360ProductID,res.cref).then((res:any)=>{
            this.processResponce(res);
          }).catch(err=>{
            this.auth.dismissLoading();
            this.auth.showAlertBoxWithAnimation("Claim Declained !","alert",`${err.message}`);
          })
        }
      }
    })
  }

  processResponce(res: any) {
    console.log(JSON.stringify(res));
    if (res.Status === "Success") {
      this.processClaimId(res.JobID,res.Underwriting);
      // this.auth.dismissLoading();
      // this.showSuccessBoxWithAnimation("Claim Submitted !","success-tick",`Your Claim has been successfully registered with ClaimID : ${res.JobID} You can Track the progress of the claim through Track My Claim`);
    } else {
      this.auth.dismissLoading();
      this.auth.showAlertBoxWithAnimation("Claim Declained !","alert",`Status : ${res.Status}`);
    }
  }

  processClaimId(JobID, underwriting: boolean) {
    const claimId = JobID;
        if (underwriting === true) {
      this.auth.sendUnderwriting(claimId)
        .then((claimResp: ClaimResponse) => {
          this.auth.dismissLoading();
          if (claimResp.Outcome === "Accepted") {
            if (
              claimResp.PaymentToBeCollected === "0" ||
              claimResp.PaymentToBeCollected == null
            ) {
              this.showSuccessBoxWithAnimation('Claim Accepted','success-tick',claimResp.OutcomeExplanation);
            } else {
              // collect payment amount if needed
              // this.showPaymentModal(claimResp, claimId);
            }
          } else if (claimResp.Outcome === "Referred") {
            if (
              claimResp.PaymentToBeCollected === "0" ||
              claimResp.PaymentToBeCollected == null
            ) {
              this.showSuccessBoxWithAnimation('Claim Referred','success-tick',claimResp.OutcomeExplanation);
            } else {
              // collect payment amount if needed
              // this.showPaymentModal(claimResp, claimId);
            }
          } else if (claimResp.Outcome === "Declined") {
            // declined need to pay
            if (
              claimResp.PaymentToBeCollected !== "0" &&
              claimResp.PaymentToBeCollected != null
            ) {
              // this.showPaymentModal(claimResp, claimId);
            } else {
              // claim failed & paymentToBeCollected is 0 or null
              this.auth.showAlertBoxWithAnimation("Claim Declained !","alert",`${claimResp.OutcomeExplanation}`);
            }
          }
        })
        .catch(err => {
          this.auth.dismissLoading();
        });
    } else {
      // Todo: underwriting false
      // write a good message
      this.auth.dismissLoading();
      this.showSuccessBoxWithAnimation("Claim Registered",'success-tick',`Your claim has been registered with claim id: ${claimId}`);
    }
  }

  ShowClaimQuestions() {
    for (let i = 0; i < Object.keys(this.claimForm.value).length; i++) {
      let precheckAns = new IPrecheck;
      precheckAns.ClaimID = "00000000-0000-0000-0000-000000000000"
      precheckAns.Answer = Object.values(this.claimForm.value)[i];
      precheckAns.QuestionID = Object.keys(this.claimForm.value)[i];
      this.precheckAnsArray.push(precheckAns);
    }
    this.precheckSubmitedAns = JSON.stringify(this.precheckAnsArray);
    this.ionSlides.slideTo(0,100);
    this.questions = [];
    console.log("No Problem not Resolved");
    if(this.data.Questions && this.data.Questions.length){
      this.questions = this.data.Questions;
      console.log(this.questions);
      this.s = this.questions[this.qCount];
      console.log(this.s);
      console.log(this.qCount+ "length of main question "+this.questions.length);
      console.log(this.questions[this.qCount]);
      this.questions.forEach(element => {
        this.claimForm.addControl(element.ID,new FormControl("",Validators.required))
      });
    }else{
      this.noQuestionFlag = true;
    }

  }

  onClickCallUs(){
    window.open('tel:03450774177');
  }


  showSuccessBoxWithAnimation(header : string, animfileName : string, msg :string) {
    return new Promise((resolve) => {
      this.alert.create({
          header: header,
          cssClass: "custom-class",
          message: `<img src="../../../assets/imgs/${animfileName}.gif"><br> ${msg}`,
          backdropDismiss: false,
          buttons: [
            {
              text: "OK",
              handler: () => {
                this.router.navigate(['dashboard'])
              },
            },
          ],
        })
        .then((res) => {
          res.present();
        });
    });
  }

}
