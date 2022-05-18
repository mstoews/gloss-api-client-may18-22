import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkbox-renderer',
  template: `
    <input
      type="checkbox"
      (click)="checkedHandler($event)"
      [checked]="params.value"
    />
  `,
})
// tslint:disable-next-line:component-class-suffix
export class CheckboxRenderer {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  checkedHandler(event) {
    const checked = event.target.checked;
    const colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
  }
}
