import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KanbanRefService {
  constructor() {}
  partyRef: string;
  clientRef: string;
  partyType: string;
  currentTabSelection: string;

  public kanbanRefUpdated = new EventEmitter<any>();

  setPartyRef(partyRef: string) {
    this.partyRef = partyRef;
    //  console.log ('set party ref ', partyRef);
    this.kanbanRefUpdated.emit(this);
  }

  public getPartyRef() {
    return this.partyRef;
  }

  setCurrentTabSelection(currentTabSelection: string) {
    this.currentTabSelection = currentTabSelection;
    this.kanbanRefUpdated.emit(currentTabSelection);
  }

  getCurrentTabSelection() {
    return this.currentTabSelection;
  }

  setPartyClient(clientRef: string) {
    this.clientRef = clientRef;
    this.kanbanRefUpdated.emit(this);
  }

  getClientRef() {
    return this.partyRef;
  }

  setPartyType(partyType: string) {
    this.partyType = partyType;
    this.kanbanRefUpdated.emit(this);
  }

  getPartyType() {
    return this.partyType;
  }
}
