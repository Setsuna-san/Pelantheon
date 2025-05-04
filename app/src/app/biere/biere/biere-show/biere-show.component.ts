import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Biere, NoteBiere } from 'src/app/models/biere';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';

@Component({
  selector: 'app-biere-show',
  templateUrl: './biere-show.component.html',
  styleUrls: ['./biere-show.component.css'],
})
export class BiereShowComponent implements OnInit {

  biere: Biere = new Biere();
  notes: NoteBiere[] = [];
  users: User[] = [];
  usersById: { [id: string]: User } = {}; // Index des utilisateurs par ID
  newNotes: NoteBiere = new NoteBiere();
  newDate: Date = new Date();

  selectedPersonne: number = 0;
  public etatLoad: Etatload = Etatload.LOADING;
  public noteLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private route: ActivatedRoute,
    private bieresService: BiereService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
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

      this.bieresService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          this.usersById = this.indexUsersById(users); // Indexation des utilisateurs
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des utilisateurs:', err);
        },
      });
    } else {
      this.router.navigate(['/bieres']);
    }

  }

  private indexUsersById(users: User[]): { [id: string]: User } {
    return users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as { [id: string]: User });
  }

  sortTable(column: keyof NoteBiere) { // Utilisez 'keyof Biere' pour restreindre les colonnes triables
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
    this.bieresService.addNote(this.newNotes).subscribe({
      next: (note) => {
        this.notes.push(this.newNotes);
        this.biere.note = (this.biere.note * this.biere.nb_notes + note.note) / (this.biere.nb_notes + 1);

        this.newNotes = new NoteBiere();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la note:', err);
      },
    });
  }
}
