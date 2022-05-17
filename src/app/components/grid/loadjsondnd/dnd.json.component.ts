import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyService } from 'app/services/party.service';
import { MatDialogRef } from '@angular/material/dialog';
import { XMLParser } from 'fast-xml-parser';
import { SnackService } from '../../../services/snack.service';

const options = {
  ignoreAttributes: true,
  removeNSPrefix: true,
  htmlEntities: true,
};

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.json.component.html',
  styleUrls: ['./dnd.json.component.scss'],
})
export class DndJSONComponent {
  constructor(
    private fb: FormBuilder,
    private partyService: PartyService,
    private snackService: SnackService,
    public dialogRef: MatDialogRef<DndJSONComponent>
  ) {
    this.createForm();
  }
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  formGroup: FormGroup;
  fileData: any;
  VERSION_NO = 1;

  map: any;

  createForm() {
    this.formGroup = this.fb.group({});
  }

  // tslint:disable-next-line:member-ordering
  onFileDropped($event): void {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      //  console.log ('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  onCreate() {
    for (const item of this.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileString = e.target.result as string;
      };
      reader.readAsText(item);
      reader.onerror = this.errorHandler;
    }
    this.dialogRef.close({ event: 'Cancel' });
  }

  errorHandler(evt): any {
    if (evt.target.error.name === 'NotReadableError') {
      console.log(
        'File can not be read properly ... please makes sure the file is xml'
      );
    }
  }

  closeDialog() {}

  updateProgress(evt: any) {
    if (evt.lengthComputable) {
      // evt.loaded and evt.total are ProgressEvent properties
      const loaded = evt.loaded / evt.total;
      if (loaded < 1) {
        this.uploadFilesSimulator(loaded);
      }
    }
  }
}
