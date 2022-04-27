import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {SpinnerService} from './spinner.service';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'loading',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 100;
  constructor(public loadingService: SpinnerService) { }

  ngOnInit(): void {
  }
}
