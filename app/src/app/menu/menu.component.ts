import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    standalone: false
})
export class MenuComponent {
  currentUrl: string = '';
  buttons = [
    { label: 'Accueil', route: '/accueil' },
    { label: 'Pizza', route: '/pizzas' },
    { label: 'Localisation', route: '/locations' },
    { label: 'À propos', route: '/propos' }
  ];

  constructor(protected authService: AuthService, private router: Router) {

  }

  login() {
    this.currentUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.currentUrl } });
  }


  logout() {
    this.currentUrl = this.router.url;
    this.authService.logout();

    if (this.currentUrl.startsWith('/admin')) {
      this.router.navigate(['/accueil']);
    } else {
      this.router.navigate([this.currentUrl]);
    }
  }

  navigate(route: string) {
    // Implémentez la logique de navigation ici, par exemple avec un routeur Angular.
    console.log(`Navigating to ${route}`);
  }
}
