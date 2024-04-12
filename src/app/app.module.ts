import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EouiSelectModule } from './eoui-select/select.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRouterModule } from './app-router.module';
import { HomeComponent } from './home/home.component';
import { E2EEouiSelectComponent } from './test/e2e.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, E2EEouiSelectComponent],
  imports: [BrowserModule, EouiSelectModule, FormsModule, BrowserAnimationsModule, AppRouterModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
