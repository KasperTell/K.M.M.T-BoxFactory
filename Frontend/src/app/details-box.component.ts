import {Component } from "@angular/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ModalController, ToastController} from "@ionic/angular";
import {HttpClient} from "@angular/common/http";
import {Box } from "../models";
import {ActivatedRoute} from "@angular/router";

@Component({

  selector: ``,
  template:

      `
        <ion-item>
          <ion-label>
            <h1>Box ID: {{box?.box_id}}</h1>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>{{box?.product_name}}</h2>
            <p></p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>{{box?.length}}</h2>
            <p>Length</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>{{box?.height}}</h2>
            <p>Height</p>
          </ion-label>
        </ion-item>

        <ion-item>
          <ion-label>
            <h2>{{box?.width}}</h2>
            <p>Width</p>
          </ion-label>
        </ion-item>

      `

       })
export class DetailsBoxComponent {

  box: Box | undefined;


  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.getId();
  }

  getId() {

    this.route.params.subscribe((params) => {
      const boxId = params['id'];
      this.http.get<Box>(`http://localhost:5000/box/${boxId}`).toPromise().then((response) => {
          this.box = response;
        },
        (error) => {
          console.error("error fetching details", error)
        });
    });

    console.log("Det virer" + this.box?.box_id)
  }
}



