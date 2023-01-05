import { Directive, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomController } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';

@Directive({
  selector: '[appFadeHeader]'
})
export class FadeHeaderDirective {

  @Input() productData : any;
  @Input('appFadeHeader') toolbar : any;
  private toolbarHeight = 44;
  urlText: string;
  constructor(private domCtrl : DomController, private router:Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.toolbar = this.toolbar.el;
    }, 100);
    this.urlText = this.router.url.replace("/","").toUpperCase();
  }

  @HostListener('ionScroll',['$event']) onContentScroll($event) {
     
    let scrollTop = $event.detail.scrollTop;
    // scrollTop = scrollTop*1.5;
    scrollTop = parseInt(scrollTop);

    if(scrollTop >= 255){
      scrollTop = 255;
    }
    
    let hexDist = scrollTop.toString(16);
    let hexDistt = (255-scrollTop).toString(16);
    
    this.domCtrl.write(()=>{
      this.toolbar.style.setProperty('--background',`#dd2127${hexDist}`);
    })

    if(scrollTop < (255/2)){
      this.domCtrl.write(()=>{
        this.toolbar.style.setProperty('--color',`#dd2127${hexDistt}`);
        this.toolbar.children[1].setAttribute("style",`--color : #dd2127${hexDistt}`);
        this.toolbar.children[0].innerText = "";
        if(this.urlText != 'DASHBOARD'){
          this.toolbar.children[0].innerText = "";        
        }else{
          this.toolbar.children[2].children[0].setAttribute('src','../../assets/imgs/logo.svg'); 
        }
      })
      
    }

    if(scrollTop > (255/1.5)){
      this.domCtrl.write(()=>{
        this.toolbar.style.setProperty('--color',`#ffffff${hexDist}`);
        this.toolbar.children[1].setAttribute("style",`color : #ffffff${hexDist}`);
        if(this.urlText != 'DASHBOARD'){
          this.toolbar.children[0].innerText = this.productData.path.replace("-"," ").toUpperCase();
          // if(this.productData.productValue == 1 || this.productData.productValue == 2 || this.productData.productValue == 3){
          //   this.toolbar.children[0].innerText = this.productData.path.replace("-"," ").toUpperCase();
          // }else{
          //   this.toolbar.children[0].innerText = this.urlText;
          // }
        }else{
          this.toolbar.children[2].children[0].setAttribute('src','../../assets/imgs/logo-white.svg'); 
        }
       
      })
    }
    
  }

}
