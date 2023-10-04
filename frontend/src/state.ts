import {Injectable} from "@angular/core";
import {Book} from "./models";

@Injectable({
  providedIn: 'root'
})
export class State {
  books: Book[] = [];
}
