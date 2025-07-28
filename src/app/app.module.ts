import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectMultipleComponent } from './components/mat-select-multiple/mat-select-multiple.component';
import {
  BufferedFooterDirective,
  BufferedSelectDirective,
} from './directives/buffered-select.directive';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
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
