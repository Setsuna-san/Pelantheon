import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: AuthService,
    private router: Router
  ) {
  }
  public bieres: Biere[] = []; // Liste des bières

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.bieres = [
      { id: 1, nom: 'Bière 1', alcool: 8, type: 'Blonde', note: 4 },
      { id: 2, nom: 'Bière 2', alcool: 8, type: 'Brune', note: 3 },
      { id: 3, nom: 'Bière 3', alcool: 8, type: 'Blanche', note: 10 },
      { id: 4, nom: 'Bière 4', alcool: 8, type: 'Ambrée', note: 5 },
      { id: 5, nom: 'Bière 5', alcool: 8, type: 'Blonde', note: 7 },
      { id: 6, nom: 'Bière 6', alcool: 8, type: 'Brune', note: 1 },
      { id: 7, nom: 'Bière 7', alcool: 8, type: 'Blanche', note: 6 },
      { id: 8, nom: 'Bière 8', alcool: 8, type: 'Ambrée', note: 8 }
    ];
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
