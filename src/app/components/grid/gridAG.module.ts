import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAGComponent } from './grid.component';
import { CheckboxRenderer } from './checkbox-renderer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from '@ag-grid-community/angular';
import { ModuleRegistry } from '@ag-grid-community/core'; // @ag-grid-community/core will always be implicitly available
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CsvExportModule } from '@ag-grid-community/csv-export';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DndJSONComponent } from './loadjsondnd/dnd.json.component';
import { DndComponent } from './loadxmldnd/dnd.component';
import { MenuBarService } from '../../services/menu.bar.service';
import { PartyService } from '../../services/party.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

@NgModule({
  declarations: [
    GridAGComponent,
    CheckboxRenderer,
    DndComponent,
    DndJSONComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  exports: [GridAGComponent],
  providers: [MenuBarService, PartyService],
})
export class GridAGModule {}
