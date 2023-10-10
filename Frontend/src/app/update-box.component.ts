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
                    label="insert title for box please" labelPlacement="floating" >
        </ion-input>
        <div *ngIf="!updateBoxFrom.controls.product_name.valid">Box title must be 3 characters
        </div>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.length" label="insert length for box please"
                   labelPlacement="floating">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.height" label="insert publisher for box please"
                   labelPlacement="floating">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.width" label="insert width for box please"
                   labelPlacement="floating">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input [formControl]="updateBoxFrom.controls.box_img_url" label="insert coverimgurl for box please"
                   labelPlacement="floating">
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



  product_name = new FormControl(this.data.box?.product_name, [Validators.minLength(3)])

  box_img_url = new FormControl(this.data.box?.box_img_url, [Validators.minLength(5)])

  updateBoxFrom = this.fb.group({
    product_name: this.product_name,
    length: [this.data.box?.length, Validators.required],
    height: [this.data.box?.height, Validators.required],
    width: [this.data.box?.width, Validators.required],
    box_img_url: this.box_img_url

  })




  async submitUpdate() {
    let boxNumber1 = this.boxElement?.box_id

    try {
      const observable = this.http.put<Box>(environment.baseUrl + '/box/'+boxNumber1, this.updateBoxFrom.getRawValue())
      const response = await firstValueFrom(observable)
      this.state.box.push(response!);



      const toast = await this.toastController.create({
        message: 'The box was successfully saved yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();

      location.reload();
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
