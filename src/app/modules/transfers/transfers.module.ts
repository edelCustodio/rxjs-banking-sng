import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfersComponent } from './transfers.component';
import { Route, RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

const routes: Route[] = [
  {
    path: '',
    component: TransfersComponent
  }
]

@NgModule({
  declarations: [
    TransfersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TransfersModule { }
