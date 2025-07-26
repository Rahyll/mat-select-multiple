import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  OnInit,
  EmbeddedViewRef,
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'ng-template[bufferedFooter]',
})
export class BufferedFooterDirective {
  constructor(public template: TemplateRef<any>) {}
}

@Directive({
  selector: 'mat-select[bufferedSelect]',
  exportAs: 'bufferedSelect',
  host: {
    '(selectionChange)': 'onSelection($event)',
    '(click)': '$event.stopPropagation()',
  },
})
export class BufferedSelectDirective implements OnInit {
  @Input() bufferedSelect = true;

  private originalValue: any[] = [];
  private tempValue: any[] = [];
  private footerView?: EmbeddedViewRef<any>;

  constructor(
    private select: MatSelect,
    private ngControl: NgControl,
    private vcRef: ViewContainerRef,
    private footerTpl: BufferedFooterDirective
  ) {}

  ngOnInit() {
    // stash the initial control value
    this.originalValue = this.ngControl.control?.value || [];
    this.tempValue = [...this.originalValue];

    // render footer template into the panel, passing apply/cancel in context
    this.footerView = this.footerTpl.template.createEmbeddedView({
      apply: () => this.apply(),
      cancel: () => this.cancel(),
    });
    this.select.panel.nativeElement.appendChild(this.footerView.rootNodes[0]);
  }

  onSelection(event: MatSelectChange) {
    // update temp, but revert actual control
    this.tempValue = [...event.value];
    this.select.writeValue(this.originalValue);
  }

  apply() {
    this.originalValue = [...this.tempValue];
    this.ngControl.control?.setValue(this.originalValue);
    this.select.close();
  }

  cancel() {
    this.tempValue = [...this.originalValue];
    this.select.writeValue(this.originalValue);
    this.select.close();
  }
}
