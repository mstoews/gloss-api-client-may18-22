import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { KanbanService } from '../module/kanban.service';
import { Party } from 'app/services/api.service';
import { Observable } from 'rxjs';
import { PartyRefService } from '../../../services/partyRef.service';
import { PartyService } from '../../../services/party.service';
import { KanbanRefService } from '../module/kanban-party-ref.service';

interface IValue {
  value: string;
  viewValue: string;
  menuDesc: string;
}

@Component({
  selector: 'app-kanban-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
})
export class KanbanMenubarComponent implements OnInit {
  @Output() notifyParentAdd: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentRefresh: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentDelete: EventEmitter<any> = new EventEmitter();
  @Output() notifyParentClone: EventEmitter<any> = new EventEmitter();
  @Output() notifyMenuItemChanged: EventEmitter<any> = new EventEmitter();

  @Input() public inTitle: string;
  @Input() public inPartyRef: string;
  @Input() public selected: string;
  public partyReference$: any;
  public partyMenu$: any;
  public menuItems: IValue[];
  party: Party;

  constructor(
    public kanbanService: KanbanService,
    public partyService: PartyService,
    public kanbanRefService: KanbanRefService
  ) {
    this.kanbanRefService.kanbanRefUpdated.subscribe((party) => {
      this.inPartyRef = party.partyRef;
    });
  }

  ngOnInit(): void {
    this.partyReference$ = this.partyService.getPartyByType('COMP');
    this.partyReference$.subscribe({
      next: (val) => {
        let count = 1;
        val.forEach((element) => {
          const item: IValue = {
            value: count.toString(),
            menuDesc: element.party_long_name,
            viewValue: element.party_ref,
          };
          if (count === 1){
            this.inPartyRef = element.party_ref;
            this.partyMenu$.setPartyRef(element.party_ref);
            this.onRefreshPartyRef(this.inPartyRef);
          }
          count++;
        });
      },
      error: (err) => console.log(err.message),
    });
  }

  // tslint:disable-next-line:variable-name
  onRefreshPartyRef(party_ref: string): void {
    this.kanbanRefService.setPartyRef(party_ref);
    this.onRefresh();
  }

  onRefresh(): void {
    this.notifyParentRefresh.emit();
  }

  onClickAdd(): void {
    this.notifyParentAdd.emit();
  }

  onClickDelete(): void {
    this.notifyParentDelete.emit();
  }

  onClickClone(): void {
    this.notifyParentClone.emit();
  }

  onClickRefresh(): void {
    this.onRefresh();
  }
}
