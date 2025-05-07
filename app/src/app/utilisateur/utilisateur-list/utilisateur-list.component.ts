import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';

@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrl: './utilisateur-list.component.css',
  standalone: false
})
export class UtilisateurListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private authService: AuthService,
    private router: Router
  ) {
  }
  public utilisateurs: User[] = []; // Liste des bières
  public etatLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  ngOnInit(): void {
    // Initialisation de la liste des bières
    // this.bieresService.getBieres().subscribe({
    //   next: (bieres) => {

    //     this.utilisateurs = bieres;
    //     this.etatLoad = Etatload.SUCCESS;
    //   },
    //   error: (err) => {
    //     this.etatLoad = Etatload.ERREUR;
    //     console.error('Erreur lors de la récupération des bières:', err);
    //   }
    // });
    this.utilisateurs = [
      new User('1', 'Alice'),
      new User('2', 'Bob'),
      new User('3', 'Charlie')
    ];
    this.etatLoad = Etatload.SUCCESS;

  }


  sortTable(column: keyof User) { // Utilisez 'keyof Biere' pour restreindre les colonnes triables
      // if (this.sortColumn === column) {
      //   this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      // } else {
      //   this.sortColumn = column;
      //   this.sortDirection = 'asc';
      // }

      // this.bieres.sort((a, b) => {
      //   const valueA = a[column];
      //   const valueB = b[column];

      //   if (valueA < valueB) {
      //     return this.sortDirection === 'asc' ? -1 : 1;
      //   }
      //   if (valueA > valueB) {
      //     return this.sortDirection === 'asc' ? 1 : -1;
      //   }
      //   return 0;
      // });
    }

    filterTable() {
      // this.bieres = this.allBieres.filter(biere => {
      //   const matchesNom = this.searchCriteria.nom
      //     ? biere.nom.toLowerCase().includes(this.searchCriteria.nom.toLowerCase())
      //     : true;
      //   const matchesType = this.searchCriteria.type
      //     ? biere.type.toUpperCase() === this.searchCriteria.type.toUpperCase()
      //     : true;
      //   const matchesNote = this.searchCriteria.note !== null
      //     ? biere.note >= this.searchCriteria.note
      //     : true;

      //   return matchesNom && matchesType && matchesNote;
      // });
    }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.route.snapshot.url.join('/')]);
    });
  }
}
