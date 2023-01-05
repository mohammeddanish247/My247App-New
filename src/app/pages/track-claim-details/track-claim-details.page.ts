import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-track-claim-details',
  templateUrl: './track-claim-details.page.html',
  styleUrls: ['./track-claim-details.page.scss'],
})
export class TrackClaimDetailsPage implements OnInit {

  claimdetails: any;
  customerSatisfaction: any;
  jobguid: string;
  productData: any;

  constructor(
    private auth: ApiService,
    private router : Router
  ) {
    let data = this.router.getCurrentNavigation().extras.state ;
    this.claimdetails = data.claim;
    this.productData = data.pageData;
  }

  ngOnInit() {
    console.log("inside ClaimDetailsPage");
  }

  // ionViewDidLoad() {
  //   console.log("ionViewDidLoad ClaimDetailsPage");
  // }

  // onClaimRatingChanged(ev: UIEvent) {
  //   this.util.showConfirm(
  //     "Customer Satisfaction",
  //     "Are you sure you want to submit this rating?",
  //     "Dismiss",
  //     "Confirm",
  //     () => {
  //       this.customerSatisfaction = null;
  //     },
  //     () => {
  //       this.auth
  //         .submitCustomerSatisfaction(
  //           this.customerSatisfaction,
  //           this.claimdetails.ClaimGuid,
  //           this.claimdetails.JobID,
  //         )
  //         .then(res => {
  //           console.log(res);
  //           this.claimdetails.CustomerSatisfaction = this.customerSatisfaction;
  //         })
  //         .catch(err => {
  //           this.util.showToastTimed(
  //             "An error occured while submitting review! Try again later.",
  //           );
  //           console.log(err);
  //         });
  //     },
  //   );
  // }

  navToLink(link) {
    window.open(`${link}`, "_system", "location=yes");
    // this.iab.create(`https://docs.google.com/viewer?url=${link}`);
  }

  getTileColor() {
    return "grey";
  }

}
