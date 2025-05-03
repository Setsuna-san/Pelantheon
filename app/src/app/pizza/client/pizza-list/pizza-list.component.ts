import { Component, OnInit } from '@angular/core';
import { CarteService } from 'src/app/services/carte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Etatload } from 'src/app/models/etatload';
import { Boisson, Categorie, Pizza } from 'src/app/models/carte';

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css'],
})
export class PizzaListComponent implements OnInit {
  public pizzas: Pizza[] = [];
  public categories: Categorie[] = [];
  public boissons: Boisson[] = [];

  public etatLoad = Etatload.LOADING;
  readonly etatLoading = Etatload;

  constructor(
    private carteService: CarteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carteService.getPizzas().subscribe({
      next: (pizzas) => {
        this.pizzas = pizzas;

        this.carteService.getCategories().subscribe({
          next: (categories) => {
            this.categories = categories;
            this.carteService.getBoissons().subscribe({
              next: (boissons) => {
                this.boissons = boissons;
                this.etatLoad = Etatload.SUCCESS;
              },
              error: (err) => (this.etatLoad = Etatload.ERREUR),
            });
          },
          error: (err) => (this.etatLoad = Etatload.ERREUR),
        });
      },
      error: (err) => (this.etatLoad = Etatload.ERREUR),
    });
  }

  pizzaOfCategorie(categorie: number): Pizza[] {
    return this.pizzas.filter((pizza) => pizza.categorie === categorie);
  }
}
