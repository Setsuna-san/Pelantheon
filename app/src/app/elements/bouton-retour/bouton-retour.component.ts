import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs';
import { HistoryService } from 'src/app/services/history.service';

@Component({
  selector: 'app-bouton-retour',
  templateUrl: './bouton-retour.component.html',
  styleUrl: './bouton-retour.component.css',
  standalone : false
})
export class BoutonRetourComponent implements OnInit {
  public asHistory : boolean = false ;
  public history : string[] = [] ;


  constructor(
    private router: Router,
    private historyService : HistoryService
  ) {

  }

  ngOnInit(): void {
    this.history = this.historyService.getHistory();
    this.asHistory = this.history.length > 0; // Vérifie correctement si l'historique est vide
  }

  retour() {
    const url = this.historyService.getPreviousPage() ;
    this.router.navigate([url], { queryParams: { b: 1 } });
  }
}
