import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { TicketDetailComponent } from './components/ticket-detail/ticket-detail.component';
import { TicketCardComponent } from './components/ticket-card/ticket-card.component';
import { TicketListComponent } from './components/ticket-list/ticket-list.component';
import { TicketFilterComponent } from './components/ticket-filter/ticket-filter.component';
import { PurchaseModalComponent } from './components/purchase-modal/purchase-modal.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component'; // Added import for LoginComponent


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'tickets', component: TicketListComponent },
  { path: 'tickets/:id', component: TicketDetailComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }, // Added login route
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    TicketDetailComponent,
    TicketCardComponent,
    TicketListComponent,
    TicketFilterComponent,
    PurchaseModalComponent,
    RegisterComponent,
    LoginComponent // Added LoginComponent to declarations
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }