import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DomController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  @ViewChild('introSlides', {static : true}) slides : IonSlides
  @ViewChild('content') content : any;
  // @ViewChild('content', {static : true}) ionContent : IonContent

  // config: SwiperOptions = {
  //     spaceBetween : 0,

  // };
  flag: boolean = false;

  slidesData = [
    {name : "Engineer", h : "Nationwide Coverage", img : "assets/imgs/intro1.png", p :"Our nationwide network of certified engineers are both Gas Safe and Covid Aware."},
    {name : "quality", h : " Welcome to 24|7", img : "assets/imgs/intro2.png", p :"lorem ipsum dolor sit amet consectetur adipisicing elit"},
    {name : "24-Hour Availability", h : "24-Hour Availability", img : "assets/imgs/247Service.png", p :"Our emergency helpline is always open. If you need us, just call us anytime."},
    // {name : "Discount", h : "Get the Best Deal, Save Big.", img : "assets/imgs/intro2.png", p :"lorem ipsum dolor sit amet consectetur adipisicing elit"},
  ]
  
  constructor(private router: Router, private dom: DomController, private storage: Storage) { }

  ngOnInit() {
    
  }

  public goBack(){
    this.flag = false;
    this.slides.slidePrev();
  }

  public goNext(){
    if(this.flag){
      console.log('set intro key true ');
        this.storage.set('introKey',true).then(()=>{
          this.router.navigate(['login']);
      })
    } 
    this.slides.slideNext().then(()=>{
      this.slides.isEnd().then((res)=>{
        this.flag = res;
        console.log(res);
      });
    });

    
    // // change content background
    // this.content = this.content.el
    // console.log(this.content);
    // this.dom.write(()=>{
    //   // this.content.style.setProperty(' --background: url(../../../assets/imgs/intro-bg.png);')
    // });

  }

  public skipBtn(){
    this.router.navigate(['login'])
  }

}
