import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {BookFeed} from "./book-feed.component";
import {HttpClientModule} from "@angular/common/http";
import {CreateBookComponent} from "./create-book.component";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, BookFeed, CreateBookComponent],
  imports: [BrowserModule, IonicModule.forRoot({mode: 'ios'}), AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
