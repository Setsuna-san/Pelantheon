import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './guards/auth.guard';
import { BiereListComponent } from './biere/biere/biere-list/biere-list.component';
import { BiereShowComponent } from './biere/biere/biere-show/biere-show.component';
import { BiereEditComponent } from './biere/biere/biere-edit/biere-edit.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InProgressComponent } from './in-progress/in-progress.component';
import { LoginComponent } from './login/login.component';
import { UtilisateurEditComponent } from './utilisateur/utilisateur-edit/utilisateur-edit.component';
import { UtilisateurListComponent } from './utilisateur/utilisateur-list/utilisateur-list.component';
import { InformationsComponent } from './informations/informations.component';

const routes: Routes = [
  { path: '', component: AcceuilComponent },
  { path: 'accueil', component: AcceuilComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin/accueil', component: AcceuilComponent, canActivate: [AuthGuard] },
  { path: 'personnes' , component: UtilisateurListComponent},
  { path: 'personnes/new', component: UtilisateurEditComponent , canActivate: [AuthGuard] },
  { path: 'personnes/:id', component: UtilisateurEditComponent , canActivate: [AuthGuard] },
  { path: 'bieres', component: BiereListComponent },
  { path: 'bieres/new', component: BiereEditComponent , canActivate: [AuthGuard] },
  { path: 'bieres/new/:ean', component: BiereEditComponent, canActivate: [AuthGuard]  },
  { path: 'bieres/edit/:id', component: BiereEditComponent , canActivate: [AuthGuard] },
  { path: 'bieres/:id', component: BiereShowComponent , canActivate: [AuthGuard] },
  { path: 'notes', component: InProgressComponent },
  { path: 'notes/new', component: InProgressComponent },
  { path: 'notes/:id', component: InProgressComponent },
  { path: 'informations', component: InformationsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
