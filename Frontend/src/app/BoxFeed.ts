import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom, from} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
import {DetailsBoxComponent} from "./details-box.component";


@Component({


  template: `
    <ion-content style="position: absolute; top: 0;">
      <ion-list>
        <ion-card [attr.data-testid]="'card_'+box.product_name" *ngFor="let box of state.box">
          <ion-toolbar>
            <ion-title>{{box.product_name}}</ion-title>
          </ion-toolbar>

          <ion-button (click)="Details(box.box_id, box.height)">Details</ion-button>
          <ion-button data-testid="delete_button" (click)="deleteBox(box.box_id)">delete</ion-button>


          <ion-card-subtitle>Dimension {{box.length}}, {{box.height}}, {{box.width}}</ion-card-subtitle>
          <img style="max-height: 200px;" [src]="box.box_img_url">
        </ion-card>
      </ion-list>

      <ion-fab>
        <ion-fab-button data-testid="create_button" (click)="openModal()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>


    </ion-content>

    <div class="notofication to-Details">

    </div>


  `,



})

export class BoxFeed implements OnInit{

box_id: number | undefined;

  constructor(public http: HttpClient, public modalController: ModalController, public state: State, public toastController: ToastController) {


  }

  async fetchBox() {
    const result = await firstValueFrom(this.http.get<Box[]>(environment.baseUrl + '/box/all'))
    this.state.box=result!;
  }

ngOnInit():void {
    this.fetchBox();
}

  async deleteBox(boxId: number | undefined) {
    try {
      await firstValueFrom(this.http.delete(environment.baseUrl + '/box/'+boxId))
      this.state.box = this.state.box.filter(b => b.box_id != boxId)
      const toast = await this.toastController.create({
        message: 'the box was successfully deleted yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
    } catch (e) {
      if(e instanceof HttpErrorResponse) {
        const toast = await this.toastController.create({
          message: 'the box was not deleted',
          color: "danger"
        });
        toast.present();
      }
    }

  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateBoxComponent
    });
    modal.present();
  }


  async Details(Box_id:  number , height: number | undefined) {

    const box_id=Box_id;


    const modal = await this.modalController.create({
      component: DetailsBoxComponent


    });
    modal.present();


  }


  get Box_id(): number {
    return <number>this.Box_id;
  }

  set Box_id(value: number) {
    this.Box_id = value;
  }


}





