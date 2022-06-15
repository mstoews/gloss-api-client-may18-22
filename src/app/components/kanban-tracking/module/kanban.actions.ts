import { Action } from '@ngrx/store';

export const ADD_TASK = 'ADD_TASK';

export class AddTask implements Action {
    readonly type = ADD_TASK;
    payload: KanbanTask;
}

