import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Etatload } from 'src/app/models/etatload';
import { Location } from 'src/app/models/location';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'app-location-menu',
  templateUrl: './location-menu.component.html',
  styleUrls: ['./location-menu.component.css']
})
export class LocationMenuComponent implements OnInit {
  public locations: Location[] = [];
  public etatLoad = Etatload.LOADING;
  readonly etatLoading = Etatload;

  constructor(
    private localisationService: LocalisationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.localisationService.getLocations().subscribe({
      next: (locations) => {
        this.locations = locations;
        this.etatLoad = Etatload.SUCCESS;
      },
      error: (err) => (this.etatLoad = Etatload.ERREUR),
    });      
}

}
