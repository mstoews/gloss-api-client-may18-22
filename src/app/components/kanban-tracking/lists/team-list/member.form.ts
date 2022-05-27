import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IStatus } from '../interface.types';

@Component({
  selector: 'app-user-from',
  template: `
    <h1 mat-dialog-title>User Reference Update</h1>
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
export class TeamMemberFormComponent {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TeamMemberFormComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IStatus
  ) {
    this.createForm(data);
  }

  createForm(status: IStatus) {
    const dDate = new Date(status.updatedte);
    const updateDate = dDate.toISOString().split('T')[0];

    if (status.updatedte === undefined) {
      status.updatedte = dDate;
    }

    this.formGroup = this.fb.group({
      type: [status.status],
      description: [status.description],
      updatedte: [dDate],
      updateusr: [status.updatedte],
    });
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
