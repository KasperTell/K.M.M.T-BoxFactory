import {Component, OnInit} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";
import {Book, ResponseDto} from "../models";
import {State} from "../state";
import {ModalController, ToastController} from "@ionic/angular";
import {CreateBookComponent} from "./create-book.component";

@Component({
  template: `
    <ion-content style="position: absolute; top: 0;">
      <ion-list>
        <ion-card [attr.data-testid]="'card_'+book.bookTitle" *ngFor="let book of state.books">
          <ion-toolbar>
            <ion-title>{{book.bookTitle}}</ion-title>
          </ion-toolbar>
          <ion-buttons>
            <ion-button (click)="deleteBook(book.bookId)">delete</ion-button>
          </ion-buttons>
          <ion-card-subtitle>by {{book.author}}</ion-card-subtitle>
          <img style="max-height: 200px;" [src]="book.coverImgUrl">
        </ion-card>
      </ion-list>

      <ion-fab>
        <ion-fab-button data-testid="createBook" (click)="openModal()">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

    </ion-content>



  `,
})
export class BookFeed implements OnInit {


  constructor(public http: HttpClient,public modalController: ModalController,
              public state: State, public toastController: ToastController) {

  }

  async fetchBooks() {

      const result = await firstValueFrom(this.http.get<ResponseDto<Book[]>>(environment.baseUrl + '/api/books'))
      this.state.books = result.responseData!;



  }

  ngOnInit(): void {
    this.fetchBooks();
  }


  async deleteBook(bookId: number | undefined) {
    try {
      await firstValueFrom(this.http.delete(environment.baseUrl + '/api/books/'+bookId))
      this.state.books = this.state.books.filter(b => b.bookId != bookId)
      const toast = await this.toastController.create({
        message: 'the book was successfully deleted yeeees',
        duration: 1233,
        color: "success"
      })
      toast.present();
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

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateBookComponent
    });
    modal.present();
  }

  protected readonly Math = Math;
}

