import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActorDetailPage } from './actor-detail';

@NgModule({
  declarations: [
    ActorDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ActorDetailPage),
  ],
})
export class ActorDetailPageModule {}
