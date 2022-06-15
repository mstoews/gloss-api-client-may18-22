import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MatDialog } from '@angular/material/dialog';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MenuBarService } from 'app/services/menu.bar.service';
import { PartyService } from 'app/services/party.service';
import { CheckboxRenderer } from './checkbox-renderer.component';
import { DndComponent } from './loadxmldnd/dnd.component';
import { DndJSONComponent } from './loadjsondnd/dnd.json.component';

@Component({
  selector: 'grid',
  template: `
    <div *ngIf="showBar === true">
      <mat-toolbar>
        <span class="fill-space">
          <button
            mat-flat-button
            (click)="onBtnExport()"
            matTooltip="Download JSON"
          >
            <mat-icon [svgIcon]="'mat_outline:download'"> </mat-icon>
            Download JSON
          </button>
          <button
            mat-flat-button
            (click)="onBtnImportJsonFile()"
            matTooltip="Upload JSON"
          >
            <mat-icon [svgIcon]="'mat_outline:upload'"></mat-icon>
            Upload JSON
          </button>
          <button
            mat-flat-button
            (click)="onBtnImport()"
            matTooltip="Upload XML Party"
          >
            <mat-icon [svgIcon]="'heroicons_outline:external-link'"> </mat-icon>
            Drag and Drop XML
          </button>
        </span>
        <!-- <span><input type="file" (change)="onFileSelect($event)" /> </span> -->
      </mat-toolbar>
    </div>
    <ag-grid-angular
      class="grid-card"
      style="width: 100%;"
      class="ag-theme-alpine-dark"
      [defaultColDef]="defaultColDef"
      [enableRangeSelection]="true"
      [animateRows]="true"
      domLayout="autoHeight"
      [rowData]="rows"
      [singleClickEdit]="true"
      [columnDefs]="cols"
      (rowDoubleClicked)="onRowDoubleClicked($event)"
      (rowClicked)="onSelectionChanged($event)"
      (cellEditingStarted)="onCellEditingStarted($event)"
      (cellEditingStopped)="onCellEditingStopped($event)"
      [rowSelection]="rowSelection"
      [modules]="modules"
      (cellValueChanged)="onCellValueChanged($event)"
      [frameworkComponents]="frameworkComponents"
      (gridReady)="onGridReady($event)"
      [paginationPageSize]="paginationPageSize"
      [pagination]="true"
    >
    </ag-grid-angular>
    <mat-progress-spinner mode="determinate" [value]="progress">
    </mat-progress-spinner>
  `,
  styleUrls: ['./grid.component.scss'],
})
export class GridAGComponent implements OnInit {
  frameworkComponents;
  progress = 0;
  timer: number;
  constructor(
    private partyService: PartyService,
    private matDialog: MatDialog,
    private menuBarShowUploadService: MenuBarService
  ) {
    this.menuBarShowUploadService.uploadMenuState.subscribe((showBar) => {
      if (this.showBar === true) {
        this.showBar = false;
      } else {
        this.showBar = true;
      }
    });
    this.frameworkComponents = { checkboxRenderer: CheckboxRenderer };
  }
  @ViewChild('agGrid') agGrid: AgGridAngular;

  @Output() private notifyOpenDialog: EventEmitter<any> = new EventEmitter();
  @Output() private notifyCellChange: EventEmitter<any> = new EventEmitter();
  @Output() private notifyFileUpload: EventEmitter<any> = new EventEmitter();

  rowSelection = 'multiple';
  showBar = false;
  page = 0;
  private gridApi;
  private gridColumnApi: any;
  public colDef: any;
  // public autoGroupColumnDef: { minWidth: number; };
  public modules: any[] = [ClientSideRowModelModule];
  public paginationPageSize = 20;
  // public getRowNodeId;

  @Input() public cols: any[];
  @Input() public rows: any[];
  @Input() public defaultColDef: any;

  startOrResumeTimer() {
    // const step = 100;
    // this.timer = setInterval(() => {
    //   this.progress = this.progress + 1;
    //   if (this.progress >= 100) {
    //     clearInterval(this.timer);
    //   }
    // }, step);
  }

  onCellEditingStarted(event: any) {
    const data = event.node.data;
    //  console.log ('Started editing: now', data.party_ref);
  }

  onCellEditingStopped(event: any) {
    // this.updateRows();
    const data = event.node.data;
    //  console.log ('Stop editing: now', data.party_ref);
  }

  onCellValueChanged(event: any) {
    const data = event.node.data;
    this.notifyCellChange.emit(data);
  }

  onMenuOpened(event: any) {}

  onRowDoubleClicked(event: any) {
    const data = event.node.data;
    this.notifyOpenDialog.emit(data);
  }

  onCellClicked(event: any) {}

  onSelectionChanged(event: any) {
    const data = event.node.data;
    this.partyService.setParty(data);
    // this.onSelectedPartyRef.emit(data);
  }

  ngOnInit() {
    if (this.colDef != null) {
      this.defaultColDef = this.colDef;
    } else {
      this.defaultColDef = {
        flex: 1,
        minWidth: 100,
        filter: true,
        sortable: true,
        resizable: true,
        suppressCellFlash: false,
        cellStyle: { color: '#5c5c5c' },
      };
    }
  }

  onRefreshGrid() {}

  onGridReady(params: {
    api: { sizeColumnsToFit: () => void };
    columnApi: any;
    setRowData: any;
    refreshCells: any;
    onMenuOpened: any;
  }) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onBtnExport() {
    const data = this.gridApi.getSelectedRows();
    for (const element of data) {
      delete element.__typename;
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
    const anchor = document.createElement('a');
    anchor.download =
      'Extract' +
      new Date().toLocaleDateString() +
      '_' +
      new Date().toLocaleTimeString() +
      '.json';
    anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
    anchor.click();
  }

  onBtnImport() {
    this.openXMLDialog();
  }

  onBtnImportJsonFile() {
    this.openJSONDialog();
  }

  onFileSelect(event) {
    const selectedFile: File = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e) => {
      this.notifyFileUpload.emit(fileReader.result);
    };
    fileReader.readAsText(selectedFile);
  }

  openXMLDialog() {
    const dialogRef = this.matDialog.open(DndComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      //  console.log ('Just before update', result.data);
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          this.create(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  openJSONDialog() {
    const dialogRef = this.matDialog.open(DndJSONComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) {
        result = { event: 'Cancel' };
      }
      switch (result.event) {
        case 'Create':
          this.loadjson(result.data);
          break;
        case 'Cancel':
          break;
      }
    });
  }

  loadjson(data: any) {
    console.log(`Create`);
  }

  create(data: any) {
    console.log(`Create`);
  }

  update(data: any) {
    console.log(`Cancel`);
  }
}
