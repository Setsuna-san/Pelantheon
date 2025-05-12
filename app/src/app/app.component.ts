import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/environment';
import { HistoryService } from './services/history.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private historyService: HistoryService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects && !event.urlAfterRedirects.includes('/login')) {
          // Ajouter l'URL actuelle à l'historique
          this.historyService.addToHistory(event.urlAfterRedirects);
        }
      }
    });
  }
}
