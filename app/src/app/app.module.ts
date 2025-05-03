import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProposComponent } from './propos/propos.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BiereListComponent } from './biere/biere/biere-list/biere-list.component';
import { NoteListComponent } from './biere/note/note-list/note-list.component';
import { BiereEditComponent } from './biere/biere/biere-edit/biere-edit.component';
import { BiereShowComponent } from './biere/biere/biere-show/biere-show.component';


@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    MenuComponent,
    ProposComponent,
    LoginComponent,
    AdminComponent,
    PageNotFoundComponent,
    BiereListComponent,
    NoteListComponent,
    BiereEditComponent,
    BiereShowComponent,
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
