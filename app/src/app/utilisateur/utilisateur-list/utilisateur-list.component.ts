import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrl: './utilisateur-list.component.css',
  standalone: false
})
export class UtilisateurListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
  }
  public utilisateurs: User[] = []; // Liste des bières
  public etatLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  public searchCriteria = {
    surnom: ''
  };


  private allUtilisateurs: User[] = []; // Liste complète des bières pour conserver les données originales

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.userService.getUsers().subscribe({
      next: (utilisateurs) => {

        this.utilisateurs = utilisateurs;
        this.etatLoad = Etatload.SUCCESS;
      },
      error: (err) => {
        this.etatLoad = Etatload.ERREUR;
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    });


  }

  sortTable(column: keyof User) { // Utilisez 'keyof Biere' pour restreindre les colonnes triables
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'asc';
      }

      this.utilisateurs.sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];

        if (valueA < valueB) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    filterTable() {
      this.utilisateurs = this.allUtilisateurs.filter(utilisateur => {
        const matchesNom = this.searchCriteria.surnom
          ? utilisateur.surnom.toLowerCase().includes(this.searchCriteria.surnom.toLowerCase())
          : true;

        return matchesNom ;
      });
    }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.route.snapshot.url.join('/')]);
    });
  }
}
