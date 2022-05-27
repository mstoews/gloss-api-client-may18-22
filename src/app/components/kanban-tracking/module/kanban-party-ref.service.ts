import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IMenuState } from './tasks.model';

@Injectable({
  providedIn: 'root',
})
export class KanbanRefService {
  constructor() {}

  menuState: IMenuState = { partyRef: 'COMP' };

  public kanbanRefUpdated = new Subject<IMenuState>();

  public setPartyRef(partyRef: string) {
    this.menuState.partyRef = partyRef;
    this.kanbanRefUpdated.next(this.menuState);
  }

  public getPartyRef() {
    return this.menuState.partyRef;
  }

  public setPartyClient(clientRef: string) {
    this.menuState.clientRef = clientRef;
    this.kanbanRefUpdated.next(this.menuState);
  }

  public setPartyType(partyType: string) {
    this.menuState.partyType = partyType;
    this.kanbanRefUpdated.next(this.menuState);
  }

  setMenuState(menuState: IMenuState) {
    this.menuState = menuState;
  }
}
