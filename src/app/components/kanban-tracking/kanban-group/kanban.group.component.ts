import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { KanbanService } from '../module/kanban.service';
import { KanbanBoardComponent } from '../kanban-card/kanban.board.component';
import { PartyService } from 'app/services/party.service';
import { KanbanRefService } from '../module/kanban-party-ref.service';
import { TasksListComponent } from '../lists/tasks-list/tasks-list.component';
// import { TreeComponent } from '../lists/dx-tree/dx-tree.component';

@Component({
  selector: 'app-kanban-group',
  templateUrl: './kanban.group.component.html',
  styleUrls: ['./kanban.group.component.scss'],
  providers: [KanbanService],
})
export class KanbanGroupComponent implements AfterViewInit {
  constructor(
    public formBuilder: FormBuilder,
    public partyService: PartyService,
    public kanbanService: KanbanService,
    kanbanRefService: KanbanRefService
  ) {
    const client = localStorage.getItem('CLIENT');
    kanbanRefService.kanbanRefUpdated.subscribe((ref) => {
      this.partyRef = ref.getPartyRef();
      this.clientRef = ref.getClientRef();
      this.currectSelection = ref.getCurrentTabSelection();
    });
  }

  @Output() public FormPartyRefChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;

  // @Input() public party: Party;
  @Input() public partyRef: string;

  formGroup: FormGroup;
  currentTab = 0;
  clientRef: string;
  currectSelection: string;

  @ViewChild(KanbanBoardComponent)
  public kanbanBoardComponent: KanbanBoardComponent;
  @ViewChild(TasksListComponent) public tasksListComponent: TasksListComponent;
  // @ViewChild(TreeComponent) public treeComponent: TreeComponent;

  tabSelection = {
    Boards: () => this.onBoard(),
    Kanban: () => this.onKanban(),
  };

  onTabChanged() {
    const tabLabel = this.tabGroup._tabs.toArray();
  }

  onBoard() {
    this.tasksListComponent.refreshData();
  }

  onKanban(): void {
    this.kanbanBoardComponent.refreshData(this.partyRef);
  }

  ngAfterViewInit() {}

  public updateKanbanTasks() {
    // this.kanbanService.setKanbanRef(this.inPartyRef);
    this.currentTab = this.tabGroup.selectedIndex;
    const tabLabel =
      this.tabGroup._tabs.toArray()[this.tabGroup.selectedIndex].textLabel;
    let param = { index: 0, tab: 'MatTab' };
    if (this.currentTab === 0) {
      this.onTabClick();
    } else {
      param = { index: this.currentTab, tab: tabLabel };
      this.onTabClick();
    }
  }

  onTabClick() {
    const tabLabel =
      this.tabGroup._tabs.toArray()[this.tabGroup.selectedIndex].textLabel;
    {
      switch (tabLabel) {
        case 'Boards': {
          // //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          break;
        }
        case 'Kanban': {
          // //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          this.kanbanBoardComponent.refreshData(this.partyRef);
          break;
        }
        case 'Board Tasks': {
          //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          this.tasksListComponent.refreshDataByRef(this.partyRef);
          break;
        }
        case 'Dependency': {
          // this.treeComponent.partyRef = this.partyRef;
          // this.treeComponent.refreshData();
          //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          break;
        }
        case 'Priority': {
          //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          break;
        }
        case 'Status': {
          //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          break;
        }
        case 'Type': {
          //  console.log (`Refreshing tabs selected ${this.partyRef} for tab ${tabLabel} `);
          break;
        }
        default:
          break;
      }
    }
  }

  onClickAdd(event: { index: any; tab?: string }) {
    this.currentTab = event.index;
    switch (event.index) {
      case 0: {
        // this.kanbanBoardComponent.openDialog();
        break;
      }
      case 1: {
        // //  console.log ('Reference Tab');
        break;
      }
      case 2: {
        // //  console.log ('Class Tab');
        break;
      }
      case 3: {
        // //  console.log ('Flag Tab');
        break;
      }
      case 4: {
        // //  console.log ('Narrative Tab');
        break;
      }
      case 5: {
        // //  console.log ('Association Add');
        break;
      }
      case 6: {
        // //  console.log ('Association Add');
        break;
      }

      default:
        break;
    }
  }

  createForm() {
    this.formGroup = this.formBuilder.group({});
  }
}
