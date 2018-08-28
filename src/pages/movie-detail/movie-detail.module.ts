import { BarRatingModule } from "ngx-bar-rating";
import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { MovieDetailPage } from "./movie-detail";

@NgModule({
    declarations: [MovieDetailPage],
    imports: [IonicPageModule.forChild(MovieDetailPage), BarRatingModule]
})
export class MovieDetailPageModule {}
