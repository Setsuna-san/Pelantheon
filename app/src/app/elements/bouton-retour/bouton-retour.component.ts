import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-bouton-retour',
  imports: [],
  templateUrl: './bouton-retour.component.html',
  styleUrl: './bouton-retour.component.css'
})
export class BoutonRetourComponent {

  constructor(
    private router: Router,
    private HistoryService : HistoryService
  ) { }

  retour() {
    const url = this.HistoryService.getPreviousPage() ;
    this.router.navigate([url], { queryParams: { b: 1 } });
  }
}
