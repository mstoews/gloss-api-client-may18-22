import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyService } from 'app/services/party.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackService } from '../../../services/snack.service';
import { XMLParser } from 'fast-xml-parser';
import {
  IParty,
  Flag,
  Classification,
  Narrative,
  Association,
  Instrument,
} from '../loadxmldnd/model.type';

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

  uploadFileProgress(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFileProgress(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 4);
      }
    }, 10);
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
    let data: any;
    for (const item of this.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileString = e.target.result as string;
        const parser = new XMLParser(options);
        data = parser.parse(fileString) as any;
        this.processFileDataFromJson(data);

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

  updateProgress(evt: any) {
    if (evt.lengthComputable) {
      // evt.loaded and evt.total are ProgressEvent properties
      const loaded = evt.loaded / evt.total;
      if (loaded < 1) {
        this.uploadFilesSimulator(loaded);
      }
    }
  }

  async processFileDataFromJson(filedata: any) {
    console.log('Process a file');
    const data = JSON.parse(filedata);
    for (const element of data) {
      this.partyService.createdatabase(element);
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }

formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
