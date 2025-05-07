import { Component, OnInit } from '@angular/core';
import { BoutonRetourComponent } from "../../elements/bouton-retour/bouton-retour.component";
import { BiereService } from 'src/app/services/biere.service';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
  styleUrl: './utilisateur-edit.component.css',
  standalone : false
})
export class UtilisateurEditComponent implements OnInit {

  constructor(
    private biereService : BiereService,
    private route : ActivatedRoute
  ) {

  }
  public personne: User = new User();
  public personneID: string | null  = null;
  public isEditing : boolean = false;

  ngOnInit(): void {
    this.personneID = this.route.snapshot.paramMap.get('id');
    if (this.personneID) {
      this.isEditing =  true;
      this.personne.surnom = "zozo"
    }
    else {
      this.personne.surnom = ""

    }
  }

  onAdd() {
      console.log('Adding a new beer');

      // if (!this.editing) {
      //   this.bieresService.addBiere(this.biere).subscribe({
      //     next: (biere) => {
      //       console.log('Beer added successfully:', biere);
      //       this.etatLoad = Etatload.SUCCESS;
      //       this.router.navigate(['/bieres/' + this.biere.id]);
      //     },
      //     error: (err) => (
      //       (this.etatLoad = Etatload.ERREUR),
      //       console.log('error added successfully :', err)
      //     ),
      //   });
      // }
    }

    onUpdate() {
      // if (environment.status === 'dev') {
      //   if (this.editing) {
      //     this.bieresService.updateBiere(this.biere).subscribe({
      //       next: (biere) => {
      //         this.etatLoad = Etatload.SUCCESS;
      //         this.router.navigate(['/bieres/' + this.biere.id]);
      //       },
      //       error: (err) => (this.etatLoad = Etatload.ERREUR),
      //     });
      //   }
      // } else {
      // }
    }



}
