import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectMultipleComponent } from './components/mat-select-multiple/mat-select-multiple.component';
import {
  BufferedFooterDirective,
  BufferedSelectDirective,
} from './directives/buffered-select.directive';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NoopAnimationsModule,
    MatButtonModule,
  ],
  declarations: [
    AppComponent,
    MatSelectMultipleComponent,
    BufferedFooterDirective,
    BufferedSelectDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
