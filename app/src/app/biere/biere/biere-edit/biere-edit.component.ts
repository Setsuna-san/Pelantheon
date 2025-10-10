import { Component, OnInit, OnDestroy } from '@angular/core';
import { Biere, TypeBiere } from 'src/app/models/biere';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BiereService } from 'src/app/services/biere.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Etatload } from 'src/app/models/etatload';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Location } from '@angular/common';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-biere-edit',
  templateUrl: './biere-edit.component.html',
  styleUrls: ['./biere-edit.component.css'],
  standalone: false,
})
export class BiereEditComponent implements OnInit, OnDestroy {
  biereId: string | null = null;
  biere: Biere = new Biere();
  public types = TypeBiere; // Liste des types de bières
  public editing: boolean = false;
  public etatLoad: Etatload = Etatload.SUCCESS;
  public etatAction: Etatload = Etatload.SUCCESS;

  public Etatload = Etatload;
  private filming: boolean = false;
  private qrCodeScanner: Html5Qrcode | null = null; // Instance du scanner
  public isCameraOpen: boolean = false; // État de la caméra

  public codeBarre: string = ''; // Code-barres scanné

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.biereId = this.route.snapshot.paramMap.get('id');
    if (this.biereId) {
      this.etatLoad = Etatload.LOADING;
      this.editing = true;
      // Fetch the beer details using the ID
      this.bieresService.getBiere(this.biereId).subscribe({
        next: (biere) => {
          this.biere = biere;
          this.etatLoad = Etatload.SUCCESS;
        },
        error: (err) => (this.etatLoad = Etatload.ERREUR),
      });
    } else {
      this.biere.nom = '';
      this.biere.alcool = 0;

      this.biere.ean = this.route.snapshot.queryParamMap.get('ean') ?? "";

      if ( this.biere.ean !== "") {
        this.getInformationsByEAN() ;
      }

    }
  }

  // onDelete() {
  //   // Handle delete action
  //   if (this.biereId) {
  //     this.bieresService.deleteBiere(this.biereId).subscribe({
  //       next: () => {
  //         this.router.navigate(['/bieres']);
  //       },
  //       error: (err) => (this.etatLoad = Etatload.ERREUR),
  //     });
  //   }
  // }

  ngOnDestroy() {
    this.closeCamera();
  }

  onAdd() {
    console.log('Adding a new beer');
    if (!this.editing) {
      this.etatAction = Etatload.LOADING;
      this.bieresService.addBiere(this.biere).subscribe({
        next: () => {
          this.etatAction = Etatload.SUCCESS;
          this.router.navigateByUrl('/bieres/' + this.biere.id);
        },
        error: (err) => {
          this.etatAction = Etatload.ERREUR;
          console.log('Erreur lors de la mise à jour', err);
        },
      });
    }
  }

  onUpdate() {
    if (this.editing) {
      this.etatAction = Etatload.LOADING;
      console.log('debut update biere');
      this.bieresService.updateBiere(this.biere).subscribe({
        next: () => {
          this.etatAction = Etatload.SUCCESS;
          this.router.navigateByUrl('/bieres/' + this.biere.id);
        },
        error: (err) => {
          this.etatAction = Etatload.ERREUR;
          console.log('Erreur lors de la mise à jour', err);
        },
      });
    }
  }

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
          this.biere.ean = decodedText;

          this.closeCamera(); // Ferme la caméra après un scan réussi
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

  getInformationsByEAN() {
    if (this.biere.ean) {
      this.bieresService.getInformations(this.biere.ean).subscribe({
      next: (info) => {
        this.biere.nom = this.biere.nom || info.name;
        this.biere.imgUrl = info.image;
        this.biere.alcool = Number(info.alcool) || this.biere.alcool;
        this.biere.type = info.type;
      },
      error: (err) => {

        console.log('Erreur lors de la récupération des infos : ' + err);
      },
    });
    }

  }
}
