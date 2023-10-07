import {Component} from "@angular/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {State} from "../state";
import {Box, ResponseDto} from "../models";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";


@Component({
    template:

      `
        <ion-list>

          <ion-item>
            <ion-input [formControl]="createNewboxFrom.controls.product_name" label="insert title for box please">
            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.product_name.valid">Box title must be 4 characters
            </div>
          </ion-item>

          <ion-item>
            <ion-input [formControl]="createNewboxFrom.controls.length" label="insert length for box please">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input [formControl]="createNewboxFrom.controls.height" label="insert publisher for box please">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input [formControl]="createNewboxFrom.controls.width" label="insert width for box please">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-input [formControl]="createNewboxFrom.controls.box_img_url" label="insert coverimgurl for box please">
            </ion-input>
          </ion-item>

          <ion-button [disabled]="createNewboxFrom.invalid" (click)="submit()">send

          </ion-button>
        </ion-list>

      `

       })
export class CreateBoxComponent {

  product_name = new FormControl('', [Validators.minLength(3)])

  box_img_url = new FormControl('', [Validators.minLength(5)])

  createNewboxFrom = this.fb.group({
    product_name: this.product_name,
    length: ['', Validators.required],
    height: ['', Validators.required],
    width: ['', Validators.required],
    box_img_url: this.box_img_url

  })



  constructor(public fb: FormBuilder,public http: HttpClient, public state:State, public toastController: ToastController, public modalController : ModalController) {

  }

  async submit() {
    try {
      const observable = this.http.post<Box>(environment.baseUrl + '/box', this.createNewboxFrom.getRawValue())
      const response = await firstValueFrom(observable)
      this.state.box.push(response!);
      const toast = await this.toastController.create({
        message: 'The box was successfully saved yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
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
