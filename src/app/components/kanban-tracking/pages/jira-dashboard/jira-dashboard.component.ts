import { Component, ViewChild, OnInit } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
    selector: 'app-jira-dashboard',
    templateUrl: './jira-dashboard.component.html',
    styleUrls: ['./jira-dashboard.component.scss']
  })
export class JiraDashboardComponent {
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor() {
      this.chartOptions = {
        series: [
          {
            name: 'T&M',
            data: [10, 41, 57, 51, 49, 102, 69, 91, 148]
          }
        ],
        chart: {
          height: 350,
          type: 'bar'
        },
        title: {
          text: 'Monthly Time and Material'
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep'
          ]
        }
      };
    }
}
