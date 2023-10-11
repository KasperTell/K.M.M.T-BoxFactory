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
            <ion-input data-testid="create_product_name_form" [formControl]="createNewboxFrom.controls.product_name" label="insert title for box please">
            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.product_name.valid">Box title must be 3 characters long
            </div>
          </ion-item>

          <ion-item>
            <ion-input data-testid= "create_length_form" [formControl]="createNewboxFrom.controls.length" type="number" label="insert length for box please">
            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.length.valid">Box length has to be a number above 0</div>
          </ion-item>

          <ion-item>
            <ion-input data-testid = "create_height_form"[formControl]="createNewboxFrom.controls.height" type="number" label="insert height for box please">

            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.height.valid">Box height has to be a number above 0</div>
          </ion-item>

          <ion-item>
            <ion-input data-testid="create_width_form" [formControl]="createNewboxFrom.controls.width" type="number" label="insert width for box please">
            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.width.valid">Box width has to be a number above 0</div>
          </ion-item>

          <ion-item>
            <ion-input data-testid="create_box_img_url_form" [formControl]="createNewboxFrom.controls.box_img_url" label="insert coverimgurl for box please">
            </ion-input>
            <div *ngIf="!createNewboxFrom.controls.box_img_url.valid">Box image has to be at least 5 characters long</div>
          </ion-item>

          <ion-button data-testid="create_submit_form" [disabled]="createNewboxFrom.invalid" (click)="submit()">send

          </ion-button>
        </ion-list>

      `

       })
export class CreateBoxComponent {

  product_name = new FormControl('', [Validators.minLength(3), Validators.required])

  length = new FormControl(0, [Validators.min(1), Validators.required])

  height = new FormControl(0, [Validators.min(1), Validators.required])

  width = new FormControl(0, [Validators.min(1), Validators.required])

  box_img_url = new FormControl('', [Validators.minLength(5), Validators.required])
  createNewboxFrom = this.fb.group({
    product_name: this.product_name,
    length: this.length,
    height: this.height,
    width: this.width,
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
