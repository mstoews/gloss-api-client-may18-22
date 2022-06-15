import { Action } from '@ngrx/store';
import { KanbanTask } from './tasks.model';


export interface State {
    task: KanbanTask[];
    editedTask: KanbanTask;
    editedIngredientIndex: number;
}

const kanbanInitialState: State = {
    

    task: KanbanTask[new KanbanTask()],
    editedTask: null,
    editedIngredientIndex: -1
};

export function kanbanReducer(state = kanbanInitialState, action: Action){
    switch (action.type) {
        case 'ADD_TASK':
            return {
                ...state,
                task: [...state.task, action]
            };
    }


}

