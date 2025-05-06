import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-bouton-retour',
  imports: [],
  templateUrl: './bouton-retour.component.html',
  styleUrl: './bouton-retour.component.css'
})
export class BoutonRetourComponent {

  constructor(
    private location: Location // Injecte le service Location pour gérer la navigation
  ) { }

  retour() {
    this.location.back(); // Utilise la méthode back() de Location pour revenir à la page précédente
  }
}
