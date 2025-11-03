import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { Biere, TypeBiere } from 'src/app/models/biere';
import { Etatload } from 'src/app/models/etatload';

@Component({
    selector: 'app-biere-list',
    templateUrl: './biere-list.component.html',
    styleUrls: ['./biere-list.component.css'],
    standalone: false
})
export class BiereListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private authService: AuthService,
    private router: Router
  ) {
  }
  public Math = Math ; 
  public bieres: Biere[] = []; // Liste des bières
  public types = TypeBiere; // Liste des types de bières
  public etatLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  public searchCriteria = {
    nom: '',
    type: '',
    note: null as number | null,
  };

  private allBieres: Biere[] = []; // Liste complète des bières pour conserver les données originales

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.bieresService.getBieres().subscribe({
      next: (bieres) => {

        this.allBieres = bieres;
        this.bieres = bieres;
        this.etatLoad = Etatload.SUCCESS;
      },
      error: (err) => {
        this.etatLoad = Etatload.ERREUR;
        console.error('Erreur lors de la récupération des bières:', err);
      }
    });
  }

  sortTable(column: keyof Biere) { // Utilisez 'keyof Biere' pour restreindre les colonnes triables
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.bieres.sort((a, b) => {
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
    this.bieres = this.allBieres.filter(biere => {
      const matchesNom = this.searchCriteria.nom
        ? biere.nom.toLowerCase().includes(this.searchCriteria.nom.toLowerCase())
        : true;
      const matchesType = this.searchCriteria.type
        ? biere.type.toUpperCase() === this.searchCriteria.type.toUpperCase()
        : true;
      const matchesNote = this.searchCriteria.note !== null
        ? biere.note === this.searchCriteria.note
        : true;

      return matchesNom && matchesType && matchesNote;
    });
  }

  public delete(id : number) {

  }

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.route.snapshot.url.join('/')]);
    });
  }
}
