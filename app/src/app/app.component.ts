import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
}
