import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPriority } from '../interface.types';

@Component({
  selector: 'app-priority-from',
  template: `
    <h1 mat-dialog-title>Priority Reference Update</h1>
    <div mat-dialog-content>
      <form [formGroup]="formGroup" #myForm="ngForm">
        <mat-form-field>
          <input
            matInput
            placeholder="Type"
            required
            formControlName="priority"
        /></mat-form-field>

        <mat-form-field>
          <input
            matInput
            placeholder="Description"
            required
            formControlName="description"
          />
        </mat-form-field>

        <mat-form-field>
          <input
            matInput
            placeholder="Update User"
            formControlName="updateusr"
          />
        </mat-form-field>

        <mat-form-field>
          <input
            matInput
            placeholder="Update Date"
            formControlName="updatedte"
          />
        </mat-form-field>
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
export class PriorityFormComponent {
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PriorityFormComponent>,
    private fb: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: IPriority
  ) {
    this.createForm(data);
  }

  createForm(priority: IPriority) {
    const dDate = new Date(priority.updatedte);
    const updateDate = dDate.toISOString().split('T')[0];

    if (priority.updatedte === undefined) {
      priority.updatedte = dDate;
    }

    this.formGroup = this.fb.group({
      priority: [priority.priority],
      description: [priority.description],
      updatedte: [dDate],
      updateusr: [priority.updatedte],
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
