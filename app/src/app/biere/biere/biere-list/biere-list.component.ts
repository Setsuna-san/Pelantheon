import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { Biere } from 'src/app/models/biere';

@Component({
  selector: 'app-biere-list',
  templateUrl: './biere-list.component.html',
  styleUrls: ['./biere-list.component.css']
})
export class BiereListComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private authService: AuthService,
    private router: Router
  ) {
  }
  public bieres: Biere[] = []; // Liste des bières

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.bieresService.getBieres().subscribe({
      next: (bieres) => {
        this.bieres = bieres;
      },
      error: (err) => {
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

  public delete(id : number) {

  }
}
