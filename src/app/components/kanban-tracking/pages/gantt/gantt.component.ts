/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component } from '@angular/core';
import {
    Service, Task, Dependency, Resource, ResourceAssignment,
  } from './gantt.service';

@Component({
  selector: 'gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  providers: [Service],
  preserveWhitespaces: true,
})

export class GanttComponent {
    tasks: Task[];

  dependencies: Dependency[];

  resources: Resource[];

  resourceAssignments: ResourceAssignment[];

  scaleType: string;

  titlePosition: string;

  showResources: boolean;

  showDependencies: boolean;

  showCustomTaskTooltip: boolean;

  startDateRange: Date;

  endDateRange: Date;

  constructor(service: Service) {
    this.tasks = service.getTasks();
    this.dependencies = service.getDependencies();
    this.resources = service.getResources();
    this.resourceAssignments = service.getResourceAssignments();
    this.scaleType = 'months';
    this.titlePosition = 'outside';
    this.showResources = true;
    this.showDependencies = true;
    this.showCustomTaskTooltip = true;
    this.startDateRange = new Date(2022, 2, 1);
    this.endDateRange = new Date(2022, 12, 1);
  }

  getTimeEstimate(task) {
    return Math.abs(task.start - task.end) / 36e5;
  }

  getTimeLeft(task) {
    const timeEstimate = Math.abs(task.start - task.end) / 36e5;
    return Math.floor((100 - task.progress) / 100 * timeEstimate);
  }

  getTime(date) {
    return date.toLocaleString();
  }
}
