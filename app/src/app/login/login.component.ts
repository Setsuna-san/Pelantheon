import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ;
  }

  login() {
    if (this.authService.login(this.username, this.password)) {
      // Rediriger vers la page d'origine ou vers l'accueil par défaut
      this.router.navigate(['/admin/' + this.returnUrl]);
    } else {
      this.errorMessage = 'Identifiants incorrects';
    }
  }
}