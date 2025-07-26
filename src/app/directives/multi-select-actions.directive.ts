import { Directive, Renderer2 } from '@angular/core';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: '[appMultiSelectActions]'
})
export class MultiSelectActionsDirective {

  constructor(
    private matSelect:MatSelect,
    private renderer:Renderer2
  ) { }

}