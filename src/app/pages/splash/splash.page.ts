import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { splashAnimation } from 'src/app/animation/splash-animation';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit, ViewDidEnter, ViewWillEnter {

  constructor(public router : Router, private navCtrl : NavController) { 

  }

  ionViewWillEnter(): void {
    SplashScreen.hide();
    StatusBar.setOverlaysWebView({ overlay : true});
    StatusBar.hide();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.router.navigate(['login']);
      this.navCtrl.navigateForward(['login'],{
        animation : splashAnimation
      })
    }, 6000);
  }

}
