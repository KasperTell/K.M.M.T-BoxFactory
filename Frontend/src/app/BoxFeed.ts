import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom, from} from "rxjs";
import {Box, ResponseDto} from "../models";
import {State} from "../state";
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {CreateBoxComponent} from "./create-box.component";
import {DetailsBoxComponent} from "./details-box.component";
import {Router} from "@angular/router";
import {UpdateBoxComponent} from "./update-box.component";
import {DataService} from "./data.service";
import {$} from "kleur/colors";

@Component({


  template: `
    <ion-content style="position: absolute; top: 0;">

      <ion-list [attr.data-testid]="'card_'+ box.product_name" *ngFor="let box of state.box">
        <ion-card *ngIf="searchText === '' || box.product_name.toLowerCase().includes(searchText)">
          <ion-toolbar>
            <ion-title>{{box.product_name}}</ion-title>
          </ion-toolbar>


          <ion-button (click)="Details(box)">Details</ion-button>
          <ion-button (click)="updateBox(box)">Update</ion-button>
          <ion-button data-testid="delete_button" (click)="deleteArticleAlert(box.box_id)">delete</ion-button>


          <ion-card-subtitle>Dimension {{box.length}}, {{box.height}}, {{box.width}}</ion-card-subtitle>
          <img style="max-height: 200px;" [src]="box.box_img_url">
        </ion-card>
      </ion-list>

      <ion-fab>
        <ion-fab-button data-testid="create_button" (click)="createBox()">

          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>


      <app-search (searchTextChanged)="onSearchTextEntered($event)" style="position: absolute; top: 0;"></app-search>


    </ion-content>

    <div class="notofication to-Details">

    </div>


  `,



})

/*
<ng-container *ngFor="let box of state.box">
<div class="course-container" *ngIf="searchText === '' || box.product_name.toLowerCase().includes(searchText)">
  </div>
  </ng-container>

 */

export class BoxFeed implements OnInit{

  boxElement: Box | undefined;


  constructor(public http: HttpClient, public modalController: ModalController, public state: State, public toastController: ToastController, private router: Router,private data: DataService,public alertController: AlertController)
  {


  }

    searchText: string = '';

    onSearchTextEntered(searchValue: string) {
      this.searchText = searchValue;
      console.log(this.searchText)
    }


    async fetchBox() {
    const result = await firstValueFrom(this.http.get<Box[]>(environment.baseUrl + '/box/all'))
    this.state.box=result!;
  }

  ngOnInit():void {

    this.fetchBox();
    this.data.currentNumber.subscribe(boxElement=>this.boxElement=boxElement)

  }


  async deleteArticleAlert(boxId: number | undefined) {
    let boxId1= boxId;
    const alert = await this.alertController.create({

      message: 'Do you want to delete article?',
      buttons: [
        {
          role: "cancel",
          text: "No"
        },
        {
          role: "confirm",
          text: "Yes",
          handler: () => this.deleteBox(boxId1)
        }]
    })
    alert.present();

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


  async updateBox(boxElement: Box) {
    this.data.changeBox(boxElement)
    const modal = await this.modalController.create({

      component: UpdateBoxComponent
    });
    modal.present();

  }


  protected readonly $ = $;
}





