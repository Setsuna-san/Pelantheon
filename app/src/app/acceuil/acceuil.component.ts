import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { BiereService } from '../services/biere.service';
import { Etatload } from '../models/etatload';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css'],
  standalone: false,
})
export class AcceuilComponent implements OnDestroy {
  private filming: boolean = false;
  private qrCodeScanner: Html5Qrcode | null = null; // Instance du scanner
  public isCameraOpen: boolean = false; // État de la caméra
  public codeBarre: string = ''; // Code-barres scanné
  public asBiere: boolean = false;

  constructor(
    protected authService: AuthService,
    private router: Router,
    private biereService: BiereService
  ) {}

  public status = environment.status;

  onScan() {
    if (this.isCameraOpen) {
      this.closeCamera();
      return;
    }

    this.qrCodeScanner = new Html5Qrcode('scanButton');
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 100 }, // Ajustez la hauteur pour correspondre à un code-barres
      supportedFormats: [
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.EAN_13,
      ], // Formats spécifiques aux codes-barres
    };

    this.qrCodeScanner
      .start(
        { facingMode: 'environment' }, // Utilise la caméra arrière
        config,
        (decodedText) => {
          console.log(`Code-barres scanné : ${decodedText}`);
          this.codeBarre = decodedText;
          this.closeCamera();
          this.getBiereByEan(this.codeBarre);
        },
        (errorMessage) => {
          console.error(`Erreur de scan : ${errorMessage}`);
        }
      )
      .then(() => {
        this.isCameraOpen = true; // Marque la caméra comme ouverte
      })
      .catch((err) => {
        console.error(`Erreur lors de l'initialisation du scanner : ${err}`);
      });
  }

  closeCamera() {
    if (this.qrCodeScanner) {
      this.qrCodeScanner
        .stop()
        .then(() => {
          this.isCameraOpen = false; // Marque la caméra comme fermée
          console.log('Caméra fermée');
        })
        .catch((err) => {
          console.error(`Erreur lors de la fermeture de la caméra : ${err}`);
        });
    }
  }

  ngOnDestroy() {
    if (this.isCameraOpen) {
      this.closeCamera();
    }
  }

  getBiereByEan(ean: string) {
    this.biereService.getBiereByEan(ean).subscribe({
      next: (biere) => {
        this.router.navigateByUrl('/bieres/' + biere.id);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la bière :', err);
        this.asBiere = true;
        // this.router.navigateByUrl('/bieres/new?ean=' + ean);
      },
    });
  }
}
