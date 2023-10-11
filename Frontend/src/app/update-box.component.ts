import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {Box} from "../models";
import {environment} from "../environments/environment";
import {firstValueFrom, observable} from "rxjs";
import {DataService} from "./data.service";
import {getName} from "ionicons/dist/types/components/icon/utils";




@Component({
  template:`



    <ion-list>

      <ion-item>
        <ion-input  [formControl]="updateBoxFrom.controls.product_name"
                    labelPlacement="floating" >
          <div slot="label">Insert title for box please <ion-text color="danger">(Box title must be 3 characters)</ion-text></div>

        </ion-input>
        <div *ngIf="!updateBoxFrom.controls.product_name.valid">

        </div>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.length"  labelPlacement="floating">
          <div slot="label">Insert length for box please <ion-text color="danger">(Positiv Number)</ion-text></div>
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.height"
                   labelPlacement="floating">
          <div slot="label">Insert height for box please <ion-text color="danger">(Positiv Number)</ion-text></div>
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.width" labelPlacement="floating">
          <div slot="label">Insert width for box please <ion-text color="danger">(Positiv Number)</ion-text></div>
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.box_img_url" labelPlacement="floating">
          <div slot="label">Insert picture UML for box please <ion-text color="danger">(UMl title must be 5 characters)</ion-text></div>
        </ion-input>
      </ion-item>

      <ion-button [disabled]="updateBoxFrom.invalid" (click)="submitUpdate()">send

      </ion-button>
    </ion-list>


  `
})

export class UpdateBoxComponent implements OnInit
{
  boxElement: Box | undefined;


  constructor(public fb: FormBuilder,public http: HttpClient, public state:State, public toastController: ToastController, public modalController : ModalController,private data: DataService) {

  }

  ngOnInit(): void {
    this.data.currentNumber.subscribe(boxElement=>this.boxElement=boxElement)
  }



  product_name = new FormControl(this.data.box?.product_name, [Validators.minLength(3), Validators.required])

  length = new FormControl(this.data.box?.length, [Validators.min(1), Validators.required])

  height = new FormControl(this.data.box?.height, [Validators.min(1), Validators.required])

  width = new FormControl(this.data.box?.width, [Validators.min(1), Validators.required])

  box_img_url = new FormControl(this.data.box?.box_img_url, [Validators.minLength(5), Validators.required])

  updateBoxFrom = this.fb.group({
    product_name: this.product_name,
    length: this.length,
    height: this.height,
    width: this.width,
    box_img_url: this.box_img_url
  })

  async submitUpdate() {

    let boxNumber1 = this.boxElement?.box_id


    try {
      const observable = this.http.put<Box>(environment.baseUrl + '/box/'+boxNumber1, this.updateBoxFrom.getRawValue())
      const response = await firstValueFrom(observable)
      const id = this.state.box.findIndex(b => b.box_id == response.box_id);
      this.state.box[id] = response;



      const toast = await this.toastController.create({
        message: 'The box was successfully saved yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();

    //  location.reload();
      this.modalController.dismiss();

    } catch (e) {
      const toast=await  this.toastController.create({
        message: 'The box was unsuccessfully saved',
        duration: 1233,
        color: "danger"
      })
      toast.present();

    }

  }




}

