import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Biere, NoteBiere } from 'src/app/models/biere';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-note-add',
  standalone: false,
  templateUrl: './note-add.component.html',
  styleUrl: './note-add.component.css',
})
export class NoteAddComponent implements OnInit {
  users: User[] = [];
  bieres: Biere[] = [];
  usersById: { [id: string]: User } = {}; // Index des utilisateurs par ID
  selectedUsers: string[] = [];
  selectedBeer: string = '';
  notes: { [userId: string]: number | null } = {};
  commentaires: { [userId: string]: string } = {};

  public errorMessage = '';

  public etatLoad: Etatload = Etatload.LOADING;
  public etatSave: Etatload = Etatload.WAITING;
  public Etatload = Etatload;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bieresService: BiereService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Logique d'initialisation si nécessaire
    // const biereId = this.route.snapshot.paramMap.get('id');

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.usersById = this.userService.indexUsersById(users); // Indexation des utilisateurs

        this.bieresService.getBieres().subscribe({
          next: (bieres) => {
            this.bieres = bieres;
            this.etatLoad = Etatload.SUCCESS;
          },
          error: (err) => {
            this.etatLoad = Etatload.ERREUR;
            console.error('Erreur lors de la récupération de la bière:', err);
          },
        });
      },
      error: (err) => {
        this.etatLoad = Etatload.ERREUR;
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      },
    });
  }

  saveNotes() {
    console.log('test number of notes');

    this.etatSave = Etatload.LOADING;

    if (
      (this.selectedUsers?.length ?? 0) > Object.keys(this.notes ?? {}).length
    ) {
      this.etatSave = Etatload.ERREUR;
      this.errorMessage = 'Toutes les notes doivent être renseignées';
      console.log('invalid number of notes');
      return;
    }

    if (this.selectedBeer === '' || this.selectedBeer === null) {
      this.etatSave = Etatload.ERREUR;
      this.errorMessage = 'Veuillez selectionner une biere';
      console.log('No beer selected');
      return;
    }

    this.selectedUsers?.forEach((userId) => {
      const newNote = new NoteBiere();
      newNote.date = new Date().toISOString().substring(0, 10);
      newNote.biereId = this.selectedBeer;
      newNote.commentaire = this.commentaires[userId];
      newNote.note = this.notes[userId] ?? 0;
      newNote.userId = userId;

      this.bieresService.addNote(newNote).subscribe({
        next: (note) => console.log('Note saved with id:', note.id),
        error: (err) => console.error('Error saving note:', err),
      });
    });

    this.notes = this.commentaires = {};
    this.etatSave = Etatload.SUCCESS;
  }

  consoleNotes() {
    console.log(this.notes);
    console.log(this.commentaires);
  }

  getUserName(id: string) {
    return this.users.find((u) => u.id === id)?.surnom || 'Inconnu';
  }
}
