import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  selectedId = new Subject<string>();
  toggleSelection = new Subject<boolean>();
  deselectPressed = new Subject<boolean>();
  selectAllPressed = new Subject<boolean>();

  constructor() { }

}
