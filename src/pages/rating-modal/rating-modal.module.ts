import { BarRatingModule } from "ngx-bar-rating";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { RatingModalPage } from "./rating-modal";

@NgModule({
    declarations: [RatingModalPage],
    imports: [IonicPageModule.forChild(RatingModalPage), BarRatingModule]
})
export class RatingModalPageModule {}
