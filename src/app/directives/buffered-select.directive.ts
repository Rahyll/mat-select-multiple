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
} from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NgControl } from '@angular/forms';
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
  private tempValue: any[] = [];
  private footerView?: EmbeddedViewRef<any>;
  private openedSubscription?: Subscription;

  constructor(
    private select: MatSelect,
    private ngControl: NgControl,
    private vcRef: ViewContainerRef
  ) {}

  ngOnInit() {
    // stash the initial control value
    this.originalValue = this.ngControl.control?.value || [];
    this.tempValue = [...this.originalValue];
  }

  ngAfterViewInit() {
    // Listen for panel opening to render footer
    this.openedSubscription = this.select.openedChange.subscribe(opened => {
      if (opened && this.footerTpl && this.select.panel) {
        // Sync the visual state with current form control value when opening
        this.syncVisualState();
        this.renderFooter();
      }
    });
  }

  private syncVisualState() {
    // Ensure the visual state matches the current form control value
    const currentValue = this.ngControl.control?.value || [];
    this.select.writeValue(currentValue);
    // Update temp value to match current state
    this.tempValue = [...currentValue];
  }

  ngOnDestroy() {
    if (this.openedSubscription) {
      this.openedSubscription.unsubscribe();
    }
  }

  private renderFooter() {
    console.log('Rendering footer...');
    console.log('Footer template exists:', !!this.footerTpl);
    console.log('Select panel exists:', !!this.select.panel);
    
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
    console.log('Footer rendered successfully');
  }

  onSelection(event: MatSelectChange) {
    // update temp value but don't revert the visual state
    this.tempValue = [...event.value];
    // Prevent the form control from being updated immediately
    // The form control should only be updated when Apply is clicked
    // Don't call this.select.writeValue(this.originalValue) here
    // This allows the checkboxes to show the temporary selection
  }

  apply() {
    this.originalValue = [...this.tempValue];
    this.ngControl.control?.setValue(this.originalValue);
    // Sync the visual state with the committed value
    this.select.writeValue(this.originalValue);
    this.select.close();
  }

  cancel() {
    // Reset temp value to the original committed value
    this.tempValue = [...this.originalValue];
    // Revert the visual state to the original value
    this.select.writeValue(this.originalValue);
    // Also update the form control to the original value
    this.ngControl.control?.setValue(this.originalValue);
    this.select.close();
  }
}
