import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { AdminPizzaListComponent} from './pizza/admin/pizza-list/pizza-list.component';
import { AdminPizzaEditComponent } from './pizza/admin/pizza-edit/pizza-edit.component';
import { AdminPizzaDetailComponent } from './pizza/admin/pizza-detail/pizza-detail.component';
import { LocationMenuComponent } from './location/location-menu/location-menu.component';
import { ProposComponent } from './propos/propos.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { PizzaListComponent } from './pizza/client/pizza-list/pizza-list.component';
import { PizzaDetailComponent } from './pizza/client/pizza-detail/pizza-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: 'admin/pizzas', component:AdminPizzaListComponent, canActivate: [AuthGuard] },
  { path: 'admin/pizza/edit', component:AdminPizzaEditComponent,canActivate: [AuthGuard] },
  { path: 'admin/pizza/edit/:id', component:AdminPizzaEditComponent,canActivate: [AuthGuard] },
  { path: 'admin/pizza/:id', component:PizzaDetailComponent, canActivate: [AuthGuard]},
  { path: 'pizzas', component:PizzaListComponent},
  { path: 'pizza/detail', component:PizzaDetailComponent},
  { path: 'propos', component:ProposComponent },
  { path: 'locations', component:LocationMenuComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'accueil', component: AcceuilComponent},
  { path: '', component: AcceuilComponent},

  { path: '**', component: AcceuilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
