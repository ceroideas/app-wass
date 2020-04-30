import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreloadComponent } from './animations/preload/preload.component';
import { AddNotesComponent } from './modals/add-notes/add-notes.component';
import { SegmentOptionsComponent } from './segments/segment-options/segment-options.component';
import { HeaderTopComponent } from './partials/header-top/header-top.component';
import { CommonModule } from '@angular/common';
import { BarRatingModule } from 'ngx-bar-rating';
import { LastCommentsComponent } from './modals/last-comments/last-comments.component';

@NgModule({
    declarations: [
        PreloadComponent,
        AddNotesComponent,
        SegmentOptionsComponent,
        HeaderTopComponent,
        LastCommentsComponent
    ],
    exports: [
        PreloadComponent,
        AddNotesComponent,
        SegmentOptionsComponent,
        HeaderTopComponent,
        LastCommentsComponent
    ],
    imports: [
      IonicModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      BarRatingModule
    ]
  })
  export class ComponentsModule {}
