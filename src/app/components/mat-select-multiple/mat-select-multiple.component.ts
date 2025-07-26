import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'mat-select-multiple',
  templateUrl: './mat-select-multiple.component.html',
  styleUrls: ['./mat-select-multiple.component.css'],
})
export class MatSelectMultipleComponent implements OnInit {
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  form = new FormGroup({
    fruitsContrl: new FormControl([]),
  });

  constructor() {}

  ngOnInit() {}
}
