import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminPizzaEditComponent } from './pizza/admin/pizza-edit/pizza-edit.component';
import { AdminPizzaItemComponent } from './pizza/admin/pizza-item/pizza-item.component';
import { AdminPizzaListComponent } from './pizza/admin/pizza-list/pizza-list.component';
import { AdminPizzaDetailComponent } from './pizza/admin/pizza-detail/pizza-detail.component';
import { PizzaListComponent } from './pizza/client/pizza-list/pizza-list.component';
import { PizzaItemComponent } from './pizza/client/pizza-item/pizza-item.component';
import { PizzaDetailComponent } from './pizza/client/pizza-detail/pizza-detail.component';
import { LocationItemComponent } from './location/location-item/location-item.component';
import { LocationMapComponent } from './location/location-map/location-map.component';
import { LocationMenuComponent } from './location/location-menu/location-menu.component';
import { ProposComponent } from './propos/propos.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    MenuComponent,
    AdminPizzaEditComponent,
    AdminPizzaItemComponent,
    AdminPizzaListComponent,
    AdminPizzaDetailComponent,
    PizzaListComponent,
    PizzaItemComponent,
    PizzaDetailComponent,
    LocationItemComponent,
    LocationMapComponent,
    LocationMenuComponent,
    ProposComponent,
    LoginComponent,
    AdminComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule, 
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
