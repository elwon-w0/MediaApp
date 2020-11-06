import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivatePageRoutingModule } from './activate-routing.module';

import { ActivatePage } from './activate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActivatePageRoutingModule
  ],
  declarations: [ActivatePage]
})
export class ActivatePageModule {}
