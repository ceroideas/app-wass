import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MapPage } from './map.page';
import { ComponentsModule } from '../../../components/components.module';
import { AddNotesComponent } from '../../../components/modals/add-notes/add-notes.component';
import { LastCommentsComponent } from '../../../components/modals/last-comments/last-comments.component';

const routes: Routes = [
  {
    path: '',
    component: MapPage
  }
];

@NgModule({
  entryComponents: [AddNotesComponent, LastCommentsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [MapPage]
})
export class MapPageModule {}
