import { Component, OnInit } from '@angular/core';
import { Biere, TypeBiere } from 'src/app/models/biere';
import { ActivatedRoute } from '@angular/router';
import { BiereService } from 'src/app/services/biere.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Etatload } from 'src/app/models/etatload';
@Component({
  selector: 'app-biere-edit',
  templateUrl: './biere-edit.component.html',
  styleUrls: ['./biere-edit.component.css'],
})
export class BiereEditComponent implements OnInit {
  biereId: string | null = null;
  biere: Biere = new Biere();
  public types = TypeBiere;
  public editing: boolean = false;
  public etatLoad: Etatload = Etatload.SUCCESS;
  public Etatload = Etatload;

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private router: Router,
    private authService: AuthService
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
    }
    else {
      this.biere.nom = '';
      this.biere.alcool = 0;
    }
  }

  onCancel() {
    // Handle cancel action
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

  onAdd() {
    console.log('Adding a new beer');

    if (!this.editing) {
      this.bieresService.addBiere(this.biere).subscribe({
        next: (biere) => {
          console.log('Beer added successfully:', biere);
          this.etatLoad = Etatload.SUCCESS;
          this.router.navigate(['/bieres/' + this.biere.id]);
        },
        error: (err) => (
          (this.etatLoad = Etatload.ERREUR),
          console.log('error added successfully :', err)
        ),
      });
    }
  }

  onUpdate() {
    if ( environment.status === 'dev') {
      if (this.editing) {
        this.bieresService.updateBiere(this.biere).subscribe({
          next: (biere) => {
            this.biere = biere;
            this.etatLoad = Etatload.SUCCESS;
            this.router.navigate(['/bieres/' + this.biere.id]);
          },
          error: (err) => (this.etatLoad = Etatload.ERREUR),
        });
      }
    }
    else {

    }

  }
}
