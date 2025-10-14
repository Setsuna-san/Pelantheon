import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css'],
  standalone: false,
})
export class QrcodeComponent {
  private token: string = '';
  public message: string = 'En attente du scan du QR Code...';
  public valide: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  ngOnInit(): void {
    // Remplace await delay par setTimeout
    setTimeout(() => {
      this.userService.qrcodeConnexion(this.token).subscribe((isValid) => {
        if (isValid) {
          this.message = 'Token correct ✅';
          this.valide = 1;
          this.userService.saveFirestoreTokenToLocalStorage();

          setTimeout(() => {
            this.router.navigate(['/accueil']);
            console.log('Redirection vers /notes');
          }, 7000);
        } else {
          this.message = 'Token incorrect ❌';
          this.valide = 2;
        }
      });
    }, 1000); // délai de 1 seconde
  }
}
