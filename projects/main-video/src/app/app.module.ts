import { NgModule } from '@angular/core';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedLibModule } from 'shared-lib';
// import 'hammerjs';


import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

//Custom components

import { MainFormComponent } from './components/forms/main-form/main-form.component';
import { MainFormDialogComponent } from './components/dialogs/main-form-dialog/main-form-dialog.component';
import { MainTableComponent } from './components/tables/main-table/main-table.component';


//Material Components

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule} from '@angular/material/radio';

import { MatListModule } from '@angular/material/list';

import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    MainFormComponent,
    MainFormDialogComponent,
    MainTableComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    //FlexLayoutModule
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatGridListModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    SharedLibModule.forRoot(environment)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
