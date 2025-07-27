import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  Input,
  OnInit,
  AfterViewInit,
  EmbeddedViewRef,
  ContentChild,
  OnDestroy,
  ElementRef,
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgControl, FormControl } from '@angular/forms';
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
  private isUpdateFromDirective = false;

  constructor(
    private select: MatSelect,
    private ngControl: NgControl,
    private vcRef: ViewContainerRef,
    private elementRef: ElementRef
  ) {
    this.dummyControl = new FormControl([]);
  }

  ngOnInit() {
    this.originalValue = this.ngControl.control?.value || [];
    this.tempValue = [...this.originalValue];
    this.overrideFormControlBinding();
    this.dummyControl.setValue(this.originalValue);
  }

  private overrideFormControlBinding() {
    (this.select as any).ngControl = { control: this.dummyControl };
    
    if (this.ngControl.control) {
      const originalSetValue = this.ngControl.control.setValue.bind(this.ngControl.control);
      this.ngControl.control.setValue = (value: any, options?: any) => {
        if (this.isUpdateFromDirective) {
          originalSetValue(value, options);
        }
      };
    }
  }

  ngAfterViewInit() {
    this.openedSubscription = this.select.openedChange.subscribe(opened => {
      if (opened && this.footerTpl && this.select.panel) {
        this.syncVisualState();
        this.renderFooter();
      } else if (!opened) {
        // When panel closes, check if there are unsaved changes and revert if needed
        this.handlePanelClose();
      }
    });
  }

  ngOnDestroy() {
    this.openedSubscription?.unsubscribe();
  }

  private renderFooter() {
    this.footerView?.destroy();
    this.footerView = this.footerTpl!.template.createEmbeddedView({
      apply: () => this.apply(),
      cancel: () => this.cancel(),
    });
    this.select.panel.nativeElement.appendChild(this.footerView.rootNodes[0]);
  }

  private syncVisualState() {
    const currentValue = this.ngControl.control?.value || [];
    this.originalValue = [...currentValue];
    this.tempValue = [...currentValue];
    this.dummyControl.setValue(currentValue);
    
    // Ensure visual state matches the current value
    if (this.select.options) {
      this.select.options.forEach(option => {
        if (this.originalValue.includes(option.value)) {
          option.select();
        } else {
          option.deselect();
        }
      });
    }
  }

  onSelection(event: MatSelectChange) {
    this.tempValue = [...event.value];
    this.dummyControl.setValue(this.tempValue);
  }

  apply() {
    this.originalValue = [...this.tempValue];
    this.isUpdateFromDirective = true;
    this.ngControl.control?.setValue(this.originalValue);
    this.isUpdateFromDirective = false;
    this.select.close();
  }

  cancel() {
    this.tempValue = [...this.originalValue];
    this.dummyControl.setValue(this.originalValue);
    
    // Clear the visual selection state by deselecting all options first
    if (this.select.options) {
      this.select.options.forEach(option => {
        option.deselect();
      });
      
      // Then select only the original values
      this.originalValue.forEach(value => {
        const option = this.select.options.find(opt => opt.value === value);
        if (option) {
          option.select();
        }
      });
    }
    
    this.select.close();
  }

  private handlePanelClose() {
    // Check if there are unsaved changes by comparing tempValue with originalValue
    const hasChanges = JSON.stringify(this.tempValue) !== JSON.stringify(this.originalValue);
    
    if (hasChanges) {
      // Revert to original state when panel closes with unsaved changes
      this.tempValue = [...this.originalValue];
      this.dummyControl.setValue(this.originalValue);
      
      // Reset visual state
      if (this.select.options) {
        this.select.options.forEach(option => {
          if (this.originalValue.includes(option.value)) {
            option.select();
          } else {
            option.deselect();
          }
        });
      }
    }
  }
}
