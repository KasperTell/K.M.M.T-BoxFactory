import {Component} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {Book, ResponseDto} from "../models";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {State} from "../state";
import {firstValueFrom} from "rxjs";
import {ModalController, ToastController} from "@ionic/angular";

@Component({
  template: `

  <ion-list>
    <ion-item>
      <ion-input [formControl]="createNewbookForm.controls.bookTitle" data-testid="titleInput" label="Insert title for book, please">

      </ion-input>
      <div *ngIf="!createNewbookForm.controls.bookTitle.valid">book title must be 4 chars or more</div>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="createNewbookForm.controls.author" data-testid="authorInput"  label="insert author for book please">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input [formControl]="createNewbookForm.controls.publisher" data-testid="publisherInput"  label="insert publisher for book please">

      </ion-input>
    </ion-item>
    <ion-item>
      <ion-input  [formControl]="createNewbookForm.controls.coverImgUrl"  data-testid="coverImgUrlInput"   label="insert coverimgurl for book please">

      </ion-input>
    </ion-item>

    <ion-item>
      <ion-button data-testid="submit" [disabled]="createNewbookForm.invalid" (click)="submit()">send</ion-button>
    </ion-item>
  </ion-list>

  `
})
export class CreateBookComponent {

  createNewbookForm = this.fb.group({
    bookTitle: ['', Validators.minLength(4)],
    author: ['', Validators.required],
    publisher: ['', Validators.required],
    coverImgUrl: ['', Validators.required]
  })

  constructor(public fb: FormBuilder, public modalController: ModalController, public http: HttpClient, public state: State, public toastController: ToastController) {
  }

  async submit() {

    try {
      const observable =     this.http.post<ResponseDto<Book>>(environment.baseUrl + '/api/books', this.createNewbookForm.getRawValue())

      const response = await firstValueFrom(observable);
      this.state.books.push(response.responseData!);

      const toast = await this.toastController.create({
        message: 'the book was successfully deleted yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
      this.modalController.dismiss();
    } catch (e) {
      if(e instanceof HttpErrorResponse) {
        const toast = await this.toastController.create({
          message: e.error.messageToClient,
          color: "danger"
        });
        toast.present();
      }
    }


  }
}
