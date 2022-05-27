export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export interface ITask {
  assignee?: Maybe<Scalars['String']>;
  classname?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  dependencies?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  due_date?: Maybe<Scalars['Date']>;
  estimate?: Maybe<Scalars['Int']>;
  Id?: Maybe<Scalars['Int']>;
  parentId?: Maybe<Scalars['Int']>;
  party_ref?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['String']>;
  rankid?: Maybe<Scalars['Int']>;
  start_date?: Maybe<Scalars['Date']>;
  status?: Maybe<Scalars['String']>;
  summary?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  task_id: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

export interface IBoard {
  boardId: string;
  boards?: ITask[];
}

export interface IValue {
  value: string;
  viewValue: string;
}

export interface IAssignee {
  team_member: string;
  first_name: string;
  last_name: string;
  location: string;
  title: string;
}

interface IType {
  type: string;
  description: string;
  updatedte: Date;
  updateusr: string;
}

export interface IPriority {
  priority: string;
  description: string;
  updatedte: Date;
  updateusr: string;
}

export interface IKanbanTask {
  task_id: string;
  party_ref: string;
  title: string;
  status: string;
  summary: string;
  type: IType[];
  priority: IPriority[];
  tags: string;
  estimate: number;
  assignee: string;
  rankid: number;
  color: IValue[];
  classname: string;
  description: string;
  due_date: Date;
  start_date: Date;
  dependencies: string;
}

export interface IMenuState {
  partyRef: string;
  partyType?: string;
  clientRef?: string;
}
