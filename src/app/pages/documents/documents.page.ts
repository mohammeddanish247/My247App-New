import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.page.html',
  styleUrls: ['./documents.page.scss'],
})
export class DocumentsPage implements OnInit {
  productData: any;

  constructor(private router:Router) {
    this.productData =  this.router.getCurrentNavigation().extras.state;
    console.log(this.productData);
   }

  ngOnInit() {
    console.log("inside Document page");    
    StatusBar.setBackgroundColor({ color : '#dd2127'});
    console.log(this.productData);
    
  }

}
