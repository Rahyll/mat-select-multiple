import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'mat-multiselect',
  templateUrl: './mat-multiselect.component.html',
  styleUrls: ['./mat-multiselect.component.css'],
})
export class MatMultiselectComponent {
  @ViewChild('select') select!: MatSelect;

  selectForm = new FormGroup({
    select: new FormControl([]),
  });

  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  /** The “live” selection in your form. */
  finalSelection: string[] = [];
  /** What’s actually shown/highlighted inside the panel. */
  tempSelection: string[] = [];

  /** Update tempSelection on each checkbox toggle. */
  onTempChange(event: any) {
    this.tempSelection = [...event.value];
  }

  /** Commit temp → final, then close panel. */
  onApply(evt: MouseEvent) {
    console.log('inside apply');
    evt.stopPropagation(); // don’t let mat-select close itself yet
    this.finalSelection = [...this.tempSelection];
    this.selectForm.get('select').setValue([...this.tempSelection]);
    this.select.close();
  }

  /** Discard temp changes, reset & close. */
  onCancel(evt: MouseEvent) {
    console.log('in close');
    evt.stopPropagation();
    this.tempSelection = [...this.selectForm.get('select').value];
    this.select.close();
  }
}
