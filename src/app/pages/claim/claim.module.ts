import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimPageRoutingModule } from './claim-routing.module';

import { ClaimPage } from './claim.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClaimPageRoutingModule
  ],
  declarations: [ClaimPage]
})
export class ClaimPageModule {}
