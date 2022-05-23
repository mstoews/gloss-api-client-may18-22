export interface IType {
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

export interface IStatus {
  status: string;
  description: string;
  updatedte: Date;
  updateusr: string;
}

export interface ITask {
  assignee: string;
  classname: string;
  color: string;
  dependencies: string;
  description: string;
  due_date: string;
  estimate: string;
  Id: string;
  parentId: number;
  party_ref: string;
  priority: string;
  rankid: number;
  start_date: string;
  status: string;
  summary: string;
  tags: string;
  task_id: string;
  title: string;
  type: string;
}

export interface IBoard {
  boardId: string;
  boards?: ITask[];
}
