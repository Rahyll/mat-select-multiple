import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  OnInit,
  AfterViewInit,
  EmbeddedViewRef,
  Optional,
  ContentChild,
  OnDestroy,
  ElementRef,
  Injector,
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgControl, FormControl, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

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
export class BufferedSelectDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() bufferedSelect = true;
  @ContentChild(BufferedFooterDirective, { static: true }) footerTpl?: BufferedFooterDirective;

  private originalValue: any[] = [];
  public tempValue: any[] = [];
  private footerView?: EmbeddedViewRef<any>;
  private openedSubscription?: Subscription;
  private dummyControl: FormControl;
  private originalNgControl: NgControl;
  private originalControlValueAccessor: ControlValueAccessor | null = null;
  private isUpdateFromDirective = false;

  constructor(
    private select: MatSelect,
    private ngControl: NgControl,
    private vcRef: ViewContainerRef,
    private elementRef: ElementRef,
    private injector: Injector
  ) {
    // Create a dummy control that won't affect the real form control
    this.dummyControl = new FormControl([]);
    this.originalNgControl = ngControl;
  }

  ngOnInit() {
    // Store the original form control value
    this.originalValue = this.ngControl.control?.value || [];
    this.tempValue = [...this.originalValue];
    
    // Completely override the form control binding
    this.overrideFormControlBinding();
    
    // Set the dummy control to the current value
    this.dummyControl.setValue(this.originalValue);
  }

  private overrideFormControlBinding() {
    // Replace the ngControl with our dummy control to prevent form control updates
    (this.select as any).ngControl = { control: this.dummyControl };
    
    // Also override the form control's setValue method to prevent updates
    if (this.originalNgControl.control) {
      const originalSetValue = this.originalNgControl.control.setValue.bind(this.originalNgControl.control);
      this.originalNgControl.control.setValue = (value: any, options?: any) => {
        // Only allow updates from our directive, not from the select
        if (this.isUpdateFromDirective) {
          originalSetValue(value, options);
        }
      };
    }
  }

  ngAfterViewInit() {
    // Listen for panel opening to render footer and sync state
    this.openedSubscription = this.select.openedChange.subscribe(opened => {
      if (opened && this.footerTpl && this.select.panel) {
        this.syncVisualState();
        this.renderFooter();
      }
    });
  }

  ngOnDestroy() {
    if (this.openedSubscription) {
      this.openedSubscription.unsubscribe();
    }
  }

  private renderFooter() {
    // Remove existing footer if any
    if (this.footerView) {
      this.footerView.destroy();
    }
    // Create new footer view
    this.footerView = this.footerTpl!.template.createEmbeddedView({
      apply: () => this.apply(),
      cancel: () => this.cancel(),
    });
    // Append to panel
    this.select.panel.nativeElement.appendChild(this.footerView.rootNodes[0]);
  }

  private syncVisualState() {
    // Sync both temp and original value to the form control's value
    const currentValue = this.originalNgControl.control?.value || [];
    this.originalValue = [...currentValue];
    this.tempValue = [...currentValue];
    // Update the dummy control to reflect the current state
    this.dummyControl.setValue(currentValue);
  }

  onSelection(event: MatSelectChange) {
    // Buffer the selection in tempValue
    this.tempValue = [...event.value];
    // Update the dummy control to reflect the selection (this won't affect the real form control)
    this.dummyControl.setValue(this.tempValue);
  }

  apply() {
    // Update the original form control with the buffered value
    this.originalValue = [...this.tempValue];
    this.isUpdateFromDirective = true;
    this.originalNgControl.control?.setValue(this.originalValue);
    this.isUpdateFromDirective = false;
    this.select.close();
  }

  cancel() {
    // Reset temp value to the original committed value
    this.tempValue = [...this.originalValue];
    // Update the dummy control to reflect the original value
    this.dummyControl.setValue(this.originalValue);
    this.select.close();
  }
}
