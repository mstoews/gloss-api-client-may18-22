export interface IPartyRef {
  party_ref: string;
  client_ref: string;
  active_ind: string;
  party_type: string;
  party_short_name: string;
  party_long_name: string;
  party_extra_long_name: string;
  has_swift_config: string;
  has_netting_config: string;
  version_no: number;
  version_date: string;
  version_user: string;
}

export interface IGlossParty {
Type: string;
Origin: string;
OriginReference: string;
OriginVersion: number;
DefaultTimeZone: string;
Name: string;
LongName: string;
ExtraLongName: string;
Inactive: string;
}

// tslint:disable-next-line:class-name
export interface data {
  Party: IParty[];
}

export interface IParty {
  Type: string;
  Origin: string;
  OriginReference: string;
  OriginVersion: number;
  DefaultTimeZone: string;
  Name: string;
  LongName: string;
  ExtraLongName: string;
  Inactive: boolean;
  Date: Date;
  Classification: Classification[];
  Reference: Reference[];
  Flag: Flag[];
  Narrative: Narrative[];
  Association: Association[];
  Instrument: Instrument[];
  Address: Address;
}

export interface Date {
  Type: string;
  Date: string;
}

export interface Classification {
  Type: any;
  Classification: any;
}

export interface Reference {
  Type: string;
  Reference: any;
}

export interface Flag {
  Type: number;
  Flag: string;
}

export interface Code {
  Name: string;
  UserDefined: UserDefined;
}

export enum UserDefined {
  N = 'N',
  Y = 'Y',
}


export interface Narrative {
  Type: string;
  Narrative: string;
}

export interface Association {
  Type: string;
  Party: Party2;
}

export interface Party2 {
  Type: string;
  Value: string;
}

export interface Instrument {
  Type: string;
  Instrument: Instrument2;
}

export interface Instrument2 {
  Type: string;
  Value: string;
}

export interface Address {
  Type: string;
  ContactName: string;
  ContactTitle: string;
  Line1: string;
  Line2: string;
  Line3: string;
  Line4: string;
  PostCode: string;
  IntDialCode: number;
  PhoneNumber: string;
  Email: string;
}
