import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarddsPageRoutingModule } from './cardds-routing.module';

import { CarddsPage } from './cardds.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarddsPageRoutingModule
  ],
  declarations: [CarddsPage]
})
export class CarddsPageModule {}
