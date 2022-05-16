import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PartyService } from 'app/services/party.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XMLParser } from 'fast-xml-parser';
import { SnackService } from '../../../services/snack.service';
import { PartyExtRefInput } from 'app/services/api.service';

import {
  IParty,
  Flag,
  Narrative,
  Association,
  Reference,
  Classification,
  Instrument,
  Party2,
  Address,
  Instrument2,
  Code,
} from './model.type';
import { Party } from '../../../services/api.service';
import { setFlagsFromString } from 'v8';
import { toNumber } from 'lodash';

const options = {
  ignoreAttributes: true,
  removeNSPrefix: true,
  htmlEntities: true,
};

@Component({
  selector: 'app-dnd',
  templateUrl: './dnd.component.html',
  styleUrls: ['./dnd.component.scss'],
})
export class DndComponent {
  constructor(
    private fb: FormBuilder,
    private partyService: PartyService,
    private snackService: SnackService,
    public dialogRef: MatDialogRef<DndComponent>
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
    let data: any;
    for (const item of this.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileString = e.target.result as string;
        const parser = new XMLParser(options);
        data = parser.parse(fileString) as IParty;
        this.processFileDataToParty(data.Party);
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

  async processFileDataToParty(party: IParty) {
    const today = new Date();
    const inputObject = {
      client_ref: '',
      party_ref: party.OriginReference,
      party_type: party.Type,
      party_short_name: party.Name,
      party_long_name: party.LongName,
      party_extra_long_name: party.ExtraLongName,
      active_ind: 'A',
      has_swift_config: 'N',
      has_netting_config: 'N',
      version_no: 0,
      version_date: today.toISOString(),
      version_user: 'ADMIN',
    };
    if (inputObject) {
      this.partyService.createParty(inputObject).subscribe(async (val) => {
        console.log('Update completed');
      });

      this.reference(party);

      this.narrative(party);

      this.classification(party);

      const flags: Flag[] = party.Flag;
      const associations: Association[] = party.Association;
      const instruments: Instrument[] = party.Instrument;

      this.updatePartyAssociation(party.OriginReference, associations);
      this.updatePartyFlag(party.OriginReference, flags);

      this.updatePartyInstruments(party.OriginReference, instruments);

      this.updatePartyAddress(party.OriginReference, party.Address);
    }
  }

  private classification(party: IParty) {
    if (Array.isArray(party.Classification)) {
      const classifications: Classification[] = party.Classification;
      this.updateClassification(party.OriginReference, classifications);
    }
    else {
      const classification: Classification = party.Classification;
      this.updateSingleClassification(party.OriginReference, classification);
    }
  }

  private narrative(party: IParty) {
    if (Array.isArray(party.Narrative)) {
      const narratives: Narrative[] = party.Narrative;
      this.updatePartyNarrative(party.OriginReference, narratives);
    }
    else {
      const narrative: Narrative = party.Narrative;
      this.updatePartySingleNarrative(party.OriginReference, narrative);
    }
  }

  private reference(party: IParty) {
    if (Array.isArray(party.Reference)) {
      const references: Reference[] = party.Reference;
      this.updatePartyReference(party.OriginReference, references);
    }
    else {
      const references: Reference = party.Reference;
      this.updatePartySingleReference(party.OriginReference, references);
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

  async updatePartyInstruments(partyRef: string, instruments: Instrument[]) {
    const today = new Date();
    if (Array.isArray(instruments)) {
      for (const val of instruments) {
        console.log(console.log(val));
        const input = {
          party_ref: partyRef,
          client_ref: '',
          instr_ref: val.Type,
          instr_type: val.Instrument.Value,
          instr_ref_type: val.Instrument.Type,
          description: '',
          version_date: today.toISOString(),
          version_no: 1,
          version_user: 'ADMIN',
        };
        this.partyService.createPartyInstr(input);
      }
    } else {
      console.log('Instrument:', instruments);
      const input = {
        party_ref: partyRef,
        client_ref: '',
        instr_ref: '',
        instr_type: '',
        instr_ref_type: '',
        description: '',
        version_date: today.toISOString(),
        version_no: 1,
        version_user: 'ADMIN',
      };
      this.partyService.createPartyInstr(input);
    }
  }

  updateClassification(
    partyRef: string,
    classifications: Classification[]
  ){
    const today = new Date();
    for (const val of classifications) {
      const input = {
        party_ref: partyRef,
        client_ref: '',
        class_type: val.Type,
        class_code: val.Classification,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
      this.partyService.createPartyClassification(input);
    }
  }

  updateSingleClassification(
    partyRef: string,
    classification: Classification
  ){
    const today = new Date();
    const input = {
        party_ref: partyRef,
        client_ref: '',
        class_type: classification.Type,
        class_code: classification.Classification,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
    this.partyService.createPartyClassification(input);
  }

updatePartySingleReference(partyRef: string, reference: Reference){
    const today = new Date();
    const input = {
        party_ref: partyRef,
        client_ref: '',
        party_ext_ref_type: reference.Type,
        party_ext_ref: reference.Reference,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
    this.createPartyExtRef(input);
  }

updatePartyReference( partyRef: string, references: Reference[])  {
    const today = new Date();
    for (const val of references) {
      const input = {
        party_ref: partyRef,
        client_ref: '',
        party_ext_ref_type: val.Type,
        party_ext_ref: val.Reference,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };

      this.createPartyExtRef(input);
    }
  }

async createPartyExtRef(data: PartyExtRefInput) {
    this.partyService.createPartyExtRef(data);
  }

updatePartyNarrative(partyRef: string, narratives: Narrative[]) {
    const today = new Date();
    for (const val of narratives) {
      const input = {
        party_ref: partyRef,
        client_ref: '',
        narr_type: val.Type,
        narrative: val.Narrative,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
      this.partyService.createPartyNarrative(input);
    }
  }

updatePartySingleNarrative(partyRef: string, narrative: Narrative) {
    const today = new Date();
    const input = {
        party_ref: partyRef,
        client_ref: '',
        narr_type: narrative.Type,
        narrative: narrative.Narrative,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
    this.partyService.createPartyNarrative(input);
  }


async updatePartyFlag(partyRef: string, flags: Flag[]) {
    console.log('updatePartyFlag', flags);
    for (const val of flags) {
      console.log(`${val.Type} : ${val.Flag}`);
      const today = new Date();
      let flagType: number;
      flagType = val.Type;
      const input = {
        party_ref: partyRef,
        client_ref: '',
        flag_type: flagType,
        flag_code: val.Flag,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN',
      };
      this.partyService.createPartyFlag(input);
    }
  }

async updatePartyAssociation(partyRef: string, associations: Association[]) {
    if (Array.isArray(associations)) {
      for (const val of associations) {
      console.log(associations);
      const today = new Date();
      const input = {
        party_ref: partyRef,
        client_ref: '',
        assoc_type: val.Party.Type,
        assoc_party_ref: val.Type,
        description: '',
        version_date: today.toISOString(),
        version_no: this.VERSION_NO,
        version_user: 'ADMIN'
      };
      this.partyService.createPartyAssociation(input);
    }
    }
  }

async updatePartyAddress(partyRef: string, address: Address) {
    console.log('updatePartyAddress', address.ContactName);
    const today = new Date();
    const add = {
      party_ref: partyRef,
      client_ref: 'CORE',
      addr_type: address.Type,
      contact_name: address.ContactName,
      contact_title: address.ContactTitle,
      addr_line1: address.Line1,
      addr_line2: address.Line2,
      addr_line3: address.Line3,
      addr_line4: address.Line4,
      addr_line5: '',
      addr_line6: '',
      post_code: address.PostCode,
      int_dial_code: address.IntDialCode.toString(),
      phone_no: address.PhoneNumber,
      fax_no: '',
      email: address.Email,
      version_date: today.toISOString(),
      version_no: this.VERSION_NO,
      version_user: 'ADMIN',
    };
    this.partyService.createPartyAddress(add);
  }
}
