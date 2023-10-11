import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Box} from "../models";


@Injectable({providedIn: 'root'})
export class DataService{


  private numberSource=new BehaviorSubject<Box | undefined>(undefined);


  currentNumber=this.numberSource.asObservable();

  box: Box | undefined


changeBox(boxElement: Box)
{
  this.box=boxElement
  this.numberSource.next(boxElement)
}


}
