import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {BoxFeed} from "./BoxFeed";
import {DetailsBoxComponent} from "./details-box.component";

const routes: Routes = [

  {
    path: '',
    redirectTo: 'box',
    pathMatch: 'full'
  },

  {
    path: 'box',
  component: BoxFeed
  },
  {
    path: 'box/:id',
    component: DetailsBoxComponent
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
