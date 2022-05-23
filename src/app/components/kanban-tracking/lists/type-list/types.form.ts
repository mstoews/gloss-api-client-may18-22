import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IType } from '../interface.types';

@Component({
  selector: 'app-priority-from',
  template: `
    <h1 mat-dialog-title>Priority Reference Update</h1>
    <div mat-dialog-content>
      <form [formGroup]="formGroup" #myForm="ngForm">
        <mat-form-field>
          <input matInput placeholder="Type" required formControlName="type"
        /></mat-form-field>
        <mat-form-field>
          <input
            matInput
            placeholder="Description"
            required
            formControlName="description"
        /></mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Update User" formControlName="updateusr"
        /></mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Update Date" formControlName="updatedte"
        /></mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions>
      <button
        mat-button
        (click)="onUpdate()"
        [disabled]="!myForm.form.valid"
        [mat-dialog-close]="data"
        mat-flat-button
        color="primary"
      >
        Update
      </button>
      <button
        mat-button
        (click)="onCreate()"
        [disabled]="!myForm.form.valid"
        [mat-dialog-close]="data"
        mat-flat-button
        color="primary"
      >
        Insert
      </button>
      <button
        mat-button
        (click)="onDelete()"
        [disabled]="!myForm.form.valid"
        [mat-dialog-close]="data"
        mat-flat-button
        color="primary"
      >
        Delete
      </button>
      <button mat-button (click)="closeDialog()" mat-flat-button color="warn">
        Cancel
      </button>
    </div>
  `,
})
export class TypeFormComponent {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TypeFormComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IType
  ) {
    this.createForm(data);
  }

  createForm(type: IType) {
    const dDate = new Date(type.updatedte);
    const updateDate = dDate.toISOString().split('T')[0];

    if (type.updatedte === undefined) {
      type.updatedte = dDate;
    }

    this.formGroup = this.fb.group({
      type: [type.type],
      description: [type.description],
      updatedte: [dDate],
      updateusr: [type.updatedte],
    });
    // this.formGroup.controls.priority.ref.disable();
  }

  onCreate() {
    const data = this.formGroup.getRawValue();
    this.dialogRef.close({ event: 'Create', data });
  }

  onUpdate() {
    const data = this.formGroup.getRawValue();
    this.dialogRef.close({ event: 'Update', data });
  }

  onDelete() {
    const data = this.formGroup.getRawValue();
    this.dialogRef.close({ event: 'Delete', data });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
