import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {BoxFeed} from "./BoxFeed";

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



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
