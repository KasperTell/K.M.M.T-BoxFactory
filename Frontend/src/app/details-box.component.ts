import {Component, Input} from "@angular/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {State} from "../state";
import {Box, ResponseDto} from "../models";
import {environment} from "../environments/environment";
import {firstValueFrom} from "rxjs";

@Component({

  selector: ``,
  template:

      `
        <ion-item>
          <ion-label>
            <h1 >H1 Heading {{getId()}}</h1>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>H2 Heading</h2>
            <p></p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>H2 Heading</h2>
            <p>Paragraph</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>H2 Heading</h2>
            <p>Paragraph</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>H2 Heading</h2>
            <p>Paragraph</p>
          </ion-label>
        </ion-item>

      `

       })
export class DetailsBoxComponent {

  private id: number | undefined;


  constructor()
{


  }

   getId(){;
  }


}
