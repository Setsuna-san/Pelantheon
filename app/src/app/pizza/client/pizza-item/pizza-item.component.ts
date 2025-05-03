import { Component, Input} from '@angular/core';
import { CarteService } from 'src/app/services/carte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pizza } from 'src/app/models/carte';


@Component({
  selector: 'app-pizza-item',
  templateUrl: './pizza-item.component.html',
  styleUrls: ['./pizza-item.component.css']
})
export class PizzaItemComponent {
  @Input() public pizza: Pizza = new Pizza();


  constructor(
    private carteService: CarteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  OnSupprimer() {
    if (confirm('Voulez-vous réellement supprimer cette pizza ?')) {
      console.log('supprimer oui')
      this.carteService.deletePizza(this.pizza).subscribe({
        next: (pizza) => {
          console.log('Suppression OK : ', pizza);
          this.router
          .navigateByUrl('/')
          .then(() => this.router.navigateByUrl('admin/pizzas'));
        },
        error: (err) => {
          alert("erreur lors de la suppression")
          console.log('ERREUR de suppression : ', err);
          this.router
            .navigateByUrl('/')
            .then(() => this.router.navigateByUrl('admin/pizzas'));

        },
      });
    } else {
      console.log('OK, on ne supprimer pas');
    }
  }

}
