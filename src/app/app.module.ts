import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, /*NoopAnimationsModule*/ } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { SearchComponent } from './components/search/search.component';
import { PageComponent } from './components/page/page.component';
import { HeaderComponent } from './components/header/header.component';
import { AdvancedSearchComponent } from './components/search/advanced-search/advanced-search.component';
import { MatNativeDateModule } from '@angular/material/core';

// For tutorial to add Angular Material components
// see https://www.positronx.io/angular-8-autocomplete-tutorial-with-angular-material/
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    PageComponent,
    HeaderComponent,
    AdvancedSearchComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    /*NoopAnimationsModule*/
    AngularMaterialModule,
    AppRoutingModule,
    AngularMaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
