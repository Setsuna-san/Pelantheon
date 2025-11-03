import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Biere, NoteBiere } from 'src/app/models/biere';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-biere-show',
  templateUrl: './biere-show.component.html',
  styleUrls: ['./biere-show.component.css'],
  standalone: false,
})
export class BiereShowComponent implements OnInit {
  public Math = Math ;
  biere: Biere = new Biere();
  notes: NoteBiere[] = [];
  users: User[] = [];
  usersById: { [id: string]: User } = {}; // Index des utilisateurs par ID
  newNotes: NoteBiere = new NoteBiere();
  public selectedPersonne: string | null = ''; // Initialisation à une chaîne vide

  public etatLoad: Etatload = Etatload.LOADING;
  public noteLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
    this.newNotes.date = new Date().toISOString().substring(0, 10);
    const biereId = this.route.snapshot.paramMap.get('id');
    if (biereId) {
      this.bieresService.getBiere(biereId).subscribe({
        next: (biere) => {
          this.biere = biere;
          this.etatLoad = Etatload.SUCCESS;
        },
        error: (err) => {
          this.etatLoad = Etatload.ERREUR;
          console.error('Erreur lors de la récupération de la bière:', err);
        },
      });
      this.bieresService.getNotesBiere(biereId).subscribe({
        next: (biere) => {
          this.notes = biere;
          this.noteLoad = Etatload.SUCCESS;
        },
        error: (err) => {
          this.noteLoad = Etatload.ERREUR;
          console.error('Erreur lors de la récupération des notes:', err);
        },
      });

      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.usersById = this.userService.indexUsersById(users); // Indexation des utilisateurs
          if (this.users.length > 0) {
            this.selectedPersonne = this.users[0].id; // Initialisation avec le premier utilisateur
          }
        },
        error: (err) => {
          console.error(
            'Erreur lors de la récupération des utilisateurs:',
            err
          );
        },
      });
    } else {
      this.router.navigate(['/bieres']);
    }
  }

  sortTable(column: keyof NoteBiere) {
    // Utilisez 'keyof Biere' pour restreindre les colonnes triables
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.notes.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onAddNote() {
    this.newNotes.biereId = this.biere.id;
    if (!this.selectedPersonne) {
      // Vérification améliorée
      console.error('Aucun utilisateur sélectionné pour la note.');
      return;
    }
    this.newNotes.userId = this.selectedPersonne; // Utilisation de la personne sélectionnée
    this.bieresService.addNote(this.newNotes).subscribe({
      next: (note) => {
        this.notes.push(this.newNotes);
        this.biere.nb_notes = this.notes.length;

        this.biere.note =
          this.notes.reduce((sum, note) => sum + note.note, 0) /
          this.notes.length;
        const dateSelected = this.newNotes.date;
        this.newNotes = new NoteBiere();
        this.newNotes.date = dateSelected;
        this.bieresService.updateBiere(this.biere);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la note:", err);
      },
    });
  }

  onPersonneChange(newPersonne: string): void {
    this.selectedPersonne = newPersonne; // Met à jour la valeur de selectedPersonne
    console.log('Personne sélectionnée :', this.selectedPersonne);
  }

  editer() {
    this.router.navigate(['/bieres/edit/' + this.biere.id]);
  }

  onDelete() {
    alert('Impossible pour le moment');
  }
}
