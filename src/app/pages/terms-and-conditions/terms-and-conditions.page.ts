import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import Swiper, { SwiperOptions, Pagination, Autoplay, EffectFade} from 'swiper';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ApiService } from 'src/app/services/api.service';
import { SwiperComponent } from 'swiper/angular';


@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TermsAndConditionsPage implements OnInit, AfterViewInit{
  productData: any;
   @ViewChild('SwiperComponent') SwiperComponent: SwiperComponent;
  swiperConfig : SwiperOptions = {
    pagination : true,
    effect : 'fade',
    // autoplay : {
    //   delay: 1000
    // },
    slidesPerView: 1,
    spaceBetween: 30,
  }

  constructor(private router: Router,
    private http : HttpClient,
    private auth : ApiService
    //  private stripe: Stripe
     ) { 
    this.productData =  this.router.getCurrentNavigation().extras.state;
    console.log(this.productData);
  }

  ngAfterViewInit(): void {
    // this.SwiperComponent.swiperRef.autoplay.running =true ;
  }

  ngOnInit() {
    Swiper.use([Pagination,Autoplay, EffectFade]);
    StatusBar.setBackgroundColor({ color : '#dd2127'});
    StatusBar.setStyle({style : Style.Dark});
    
  }

  // paymentClicked(){
  //   var stripe = Stripe('pk_test_51ME8QDSEEnlQfQjnulQ3bi79WGbkBEo8UpmvzmD2mW46vpaLpuXefwlBgKIDHbBfR1BcrYlc4JtwkosRKfPVFf1T009Szzt62y');
  //   var elements = stripe.elements();
  //   var style = {
  //     base: {
  //       color: "#32325d",
  //     }
  //   };
    
  //   var card = elements.create("card", { style: style });
  //   // card.mount("#card-element");
  // }

}
