import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom, from} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
import {DetailsBoxComponent} from "./details-box.component";
import {Router} from "@angular/router";
import {UpdateBoxComponent} from "./update-box.component";
import {DataService} from "./data.service";

@Component({


  template: `
    <ion-content style="position: absolute; top: 0;">
      <ion-list>
        <ion-card [attr.data-testid]="'card_'+box.product_name" *ngFor="let box of state.box">
          <ion-toolbar>
            <ion-title>{{box.product_name}}</ion-title>
          </ion-toolbar>


          <ion-button (click)="Details(box)">Details</ion-button>
          <ion-button (click)="updateBox(box.box_id)">Update</ion-button>
          <ion-button data-testid="delete_button" (click)="deleteBox(box.box_id)">delete</ion-button>


          <ion-card-subtitle>Dimension {{box.length}}, {{box.height}}, {{box.width}}</ion-card-subtitle>
          <img style="max-height: 200px;" [src]="box.box_img_url">
        </ion-card>
      </ion-list>

      <ion-fab>
        <ion-fab-button data-testid="createBox" (click)="createBox()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>


    </ion-content>

    <div class="notofication to-Details">

    </div>


  `,



})

export class BoxFeed implements OnInit{

boxNumber: number | undefined;

  constructor(public http: HttpClient, public modalController: ModalController, public state: State, public toastController: ToastController, private router: Router,private data: DataService) {


  }

  async fetchBox() {
    const result = await firstValueFrom(this.http.get<Box[]>(environment.baseUrl + '/box/all'))
    this.state.box=result!;
  }

ngOnInit():void {
    this.fetchBox();
  this.data.currentNumber.subscribe(BoxNumber=>this.boxNumber=BoxNumber)
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

  async createBox() {
    const modal = await this.modalController.create({
      component: CreateBoxComponent
    });
    modal.present();
  }


  async Details(box: Box) {

    const modal = await this.modalController.create({
      component: DetailsBoxComponent



    });

    this.router.navigate(['/box/', box.box_id]);
    //modal.present();


  }




  async updateBox(box_id: number) {
    this.data.changeMessage(box_id)
    const modal = await this.modalController.create({

      component: UpdateBoxComponent
    });
    modal.present();
  }
}





