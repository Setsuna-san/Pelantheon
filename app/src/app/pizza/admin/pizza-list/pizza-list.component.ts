import { Component, OnInit } from '@angular/core';
import { CarteService } from 'src/app/services/carte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Etatload } from 'src/app/models/etatload';
import { Pizza } from 'src/app/models/carte';

@Component({
  selector: 'app--admin-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css']
})
export class AdminPizzaListComponent implements OnInit {
  public pizzas: Pizza[] = [];
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
        this.etatLoad = Etatload.SUCCESS;
      },
      error: (err) => (this.etatLoad = Etatload.ERREUR),
    });
}

}
