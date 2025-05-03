import { Component, Input } from '@angular/core';
import { Location } from 'src/app/models/location';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalisationService } from 'src/app/services/localisation.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['./location-item.component.css'],
})
export class LocationItemComponent {
  @Input() public location: Location = new Location();
  public mapClicked: boolean = false;
  isEditing = false;

  constructor(
    private localisationService: LocalisationService,
    private route: ActivatedRoute,
    protected authService: AuthService,
    private router: Router
  ) {}

  onMap() {
    if (this.mapClicked == true) {
      this.mapClicked = false;
    } else {
      this.mapClicked = true;
    }
  }
  
  toggleEdit() {
    if (this.isEditing) {
      this.save();
    }
    this.isEditing = !this.isEditing;
  }

  public save(): void {
    let ObservableAction;
    ObservableAction = this.localisationService.updateLocation(this.location);

    ObservableAction.subscribe({
      next: (Location) => {
        console.log('Enregistrement OK : ', Location);
        this.router.navigate(['/locations']);
      },
      error: (err) => {
        console.log('ERREUR de sauvegarde : ', err);
      },
    });
  }
}
