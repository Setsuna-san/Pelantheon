import { Component, OnInit } from '@angular/core';
import { BoutonRetourComponent } from '../../elements/bouton-retour/bouton-retour.component';
import { BiereService } from 'src/app/services/biere.service';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Etatload } from 'src/app/models/etatload';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
  styleUrl: './utilisateur-edit.component.css',
  standalone: false,
})
export class UtilisateurEditComponent implements OnInit {
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public user: User = new User();
  public userID: string | null = null;
  public isEditing: boolean = false;
  public etatLoading: Etatload = Etatload.LOADING;
  public etatAction: Etatload = Etatload.SUCCESS;
  public Etatload = Etatload;

  ngOnInit(): void {

    this.userID = this.route.snapshot.paramMap.get('id');
    if (this.userID) {
      this.isEditing = true;
      this.user.surnom = 'zozo';
    } else {
      this.user.surnom = '';
    }
  }

  onAdd() {
    console.log('Adding a new beer');
    this.etatAction = Etatload.LOADING;
    if (!this.isEditing) {
      this.userService.addUser(this.user).subscribe({
        next: (user) => {
          console.log('Personne added successfully:', user);
          this.etatAction = Etatload.SUCCESS;
          this.router.navigate(['/personnes/' + this.user.id]);
        },
        error: (err) => (
          (this.etatAction = Etatload.ERREUR),
          console.log('error added successfully :', err)
        ),
      });
    }
  }

  onUpdate() {
    if (this.isEditing) {
      this.etatAction = Etatload.LOADING;

      this.userService.updateUser(this.user).subscribe({
        next: (user) => {
          this.etatAction = Etatload.SUCCESS;
          this.router.navigate(['/personnes/' + this.user.id]);
        },
        error: (err) => (this.etatAction = Etatload.ERREUR),
      });
    }
  }
}
