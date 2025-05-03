import { Component, Input } from '@angular/core';
import { Location } from 'src/app/models/location';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalisationService } from 'src/app/services/localisation.service';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css']
})
export class LocationMapComponent {
  @Input() public map: String = "";

  constructor(
    private localisationService: LocalisationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}



}
