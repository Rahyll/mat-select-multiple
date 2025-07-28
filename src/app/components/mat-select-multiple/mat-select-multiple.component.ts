import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'mat-select-multiple',
  templateUrl: './mat-select-multiple.component.html',
  styleUrls: ['./mat-select-multiple.component.css'],
})
export class MatSelectMultipleComponent implements OnInit {
  fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  filteredFruits: string[] = [];
  searchTerm: string = '';

  form = new FormGroup({
    fruitsControl: new FormControl([]),
  });

  searchControl = new FormControl('');

  ngOnInit() {
    this.filteredFruits = [...this.fruits];
    this.form.get('fruitsControl')?.valueChanges.subscribe(value => {
      // Handle value changes if needed
      console.log(value);
    });

    // Subscribe to search control changes
    this.searchControl.valueChanges.subscribe(searchValue => {
      this.searchTerm = searchValue || '';
      this.filterFruits();
    });
  }

  private filterFruits() {
    if (this.searchTerm.trim() === '') {
      this.filteredFruits = [...this.fruits];
    } else {
      this.filteredFruits = this.fruits.filter(fruit => 
        fruit.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
}
