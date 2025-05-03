import { Component } from '@angular/core';
import { Etatload } from 'src/app/models/etatload';
import { Pizza, Categorie, Boisson } from 'src/app/models/carte';
import { CarteService } from 'src/app/services/carte.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-admin-pizza-edit',
  templateUrl: './pizza-edit.component.html',
  styleUrls: ['./pizza-edit.component.css']
})
export class AdminPizzaEditComponent {

  public pizza = new Pizza();
  public etatLoad = Etatload.LOADING;
  readonly etatLoading = Etatload;

  constructor(
    private carteService: CarteService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    if (id) {
      this.carteService.getPizza(id).subscribe({
        next: (Pizza) => {
          this.pizza = Pizza;
          this.etatLoad = Etatload.SUCCESS;
        },
        error: (err) => (this.etatLoad = Etatload.ERREUR),
      });
    } else {
      this.etatLoad = Etatload.SUCCESS;
    }
  }

  public onSubmit(leFormulaire: NgForm): void {
    if (leFormulaire.valid) {
      let ObservableAction;
      if (this.pizza.id) {
        ObservableAction = this.carteService.updatePizza(this.pizza);
      } else {
        ObservableAction = this.carteService.addPizza(this.pizza);
      }

      ObservableAction.subscribe({
        next: (Pizza) => {
          console.log('Enregistrement OK : ', Pizza);
          this.router.navigate(['/admin/pizzas']);
        },
        error: (err) => {
          console.log('ERREUR de sauvegarde : ', err);
        },
      });
    }
  }

  Onsupprimer(): void {
    if (confirm('Voulez-vous réellement supprimer cette tâche ?')) {
      this.carteService.deletePizza(this.pizza).subscribe({
        next: (Pizza) => {
          console.log('Suppression OK : ', Pizza);
          this.router
            .navigateByUrl('/')
            .then(() => this.router.navigateByUrl('/admin/Pizzas'));
        },
        error: (err) => {
          alert("erreur lors de la suppression")
          console.log('ERREUR de suppression : ', err);
          this.router
            .navigateByUrl('/')
            .then(() => this.router.navigateByUrl('/Pizza/edit/'+ this.pizza.id));
        },
      });
    } else {
      console.log('OK, on ne supprimer pas');
    }
  }
}

