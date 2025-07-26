import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BufferedSelectDirective } from '../../directives/buffered-select.directive';

@Component({
  selector: 'mat-select-multiple',
  templateUrl: './mat-select-multiple.component.html',
  styleUrls: ['./mat-select-multiple.component.css'],
})
export class MatSelectMultipleComponent implements OnInit {
  @ViewChild(BufferedSelectDirective) bufferedSelect!: BufferedSelectDirective;
  
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  form = new FormGroup({
    fruitsControl: new FormControl([]),
  });

  constructor() {}

  ngOnInit() {
    // The directive now handles initialization automatically
    this.form.get('fruitsControl')?.valueChanges.subscribe(value => {
      console.log('fruitsControl value changed:', value);
    });
  }

  onApply() {
    // Update the form control with the buffered value
    this.form.get('fruitsControl')?.setValue(this.bufferedSelect.tempValue);
    this.bufferedSelect.apply();
  }

  onCancel() {
    this.bufferedSelect.cancel();
  }
}
