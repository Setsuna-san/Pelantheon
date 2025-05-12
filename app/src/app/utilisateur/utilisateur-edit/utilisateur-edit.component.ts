import { Component, OnInit } from '@angular/core';
import { BoutonRetourComponent } from '../../elements/bouton-retour/bouton-retour.component';
import { BiereService } from 'src/app/services/biere.service';
import { User } from 'src/app/models/user';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Etatload } from 'src/app/models/etatload';
import { Biere, NoteBiere } from 'src/app/models/biere';

@Component({
  selector: 'app-utilisateur-edit',
  templateUrl: './utilisateur-edit.component.html',
  styleUrl: './utilisateur-edit.component.css',
  standalone: false,
})
export class UtilisateurEditComponent implements OnInit {
  constructor(
    private userService: UserService,
    private biereService: BiereService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public user: User = new User();
  public userID: string | null = null;
  public isEditing: boolean = false;
  public etatLoading: Etatload = Etatload.LOADING;
  public etatAction: Etatload = Etatload.SUCCESS;
  public Etatload = Etatload;
  public etatLoad: Etatload = Etatload.LOADING;
  public noteLoad: Etatload = Etatload.LOADING;

  bieres: Biere[] = [];
  notes: NoteBiere[] = [];
  bieresById: { [id: string]: Biere } = {}; // Index des utilisateurs par ID
  newNotes: NoteBiere = new NoteBiere();
  public selectedBiere: string | null = ''; // Initialisation à une chaîne vide
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';


  ngOnInit(): void {
    this.newNotes.date = new Date().toISOString().substring(0, 10);
    this.userID = this.route.snapshot.paramMap.get('id');
    if (this.userID) {
      this.isEditing = true;
      this.user.surnom = 'zozo';

      this.userService.getUser(this.userID).subscribe({
        next: (user) => {
          this.user = user;
          this.etatLoad = Etatload.SUCCESS;
        },
        error: (err) => {
          this.etatLoad = Etatload.ERREUR;
          console.error('Erreur lors de la récupération de la bière:', err);
        },
      });
      this.biereService.getNotesUser(this.userID).subscribe({
        next: (biere) => {
          this.notes = biere;
          this.noteLoad = Etatload.SUCCESS;
        },
        error: (err) => {
          this.noteLoad = Etatload.ERREUR;
          console.error('Erreur lors de la récupération des notes:', err);
        },
      });

      this.biereService.getBieres().subscribe({
        next: (bieres) => {
          this.bieres = bieres;
          this.bieresById = this.indexBieresById(this.bieres); // Indexation des utilisateurs
          if (this.bieres.length > 0) {
            this.selectedBiere = this.bieres[0].id; // Initialisation avec le premier utilisateur
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
      this.user.surnom = '';
    }
  }

  onAdd() {
    console.log('Adding a new beer');
    this.etatAction = Etatload.LOADING;
    if (!this.isEditing) {
      this.userService.addUser(this.user).subscribe({
        next: (user) => {
          console.log('Personne added successfully:', user);
          this.etatAction = Etatload.SUCCESS;
          this.router.navigate(['/personnes/' + this.user.id]);
        },
        error: (err) => (
          (this.etatAction = Etatload.ERREUR),
          console.log('error added successfully :', err)
        ),
      });
    }
  }

  onUpdate() {
    if (this.isEditing) {
      this.etatAction = Etatload.LOADING;

      this.userService.updateUser(this.user).subscribe({
        next: (user) => {
          this.etatAction = Etatload.SUCCESS;
          this.router.navigate(['/personnes/' + this.user.id]);
        },
        error: (err) => (this.etatAction = Etatload.ERREUR),
      });
    }
  }

  private indexBieresById(bieres: Biere[]): { [id: string]: Biere } {
    return bieres.reduce((acc, biere) => {
      acc[biere.id] = biere;
      return acc;
    }, {} as { [id: string]: Biere });
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
    this.newNotes.userId = this.user.id;
    if (!this.selectedBiere) {
      // Vérification améliorée
      console.error('Aucune biere sélectionné pour la note.');
      return;
    }
    this.newNotes.biereId = this.selectedBiere; // Utilisation de la personne sélectionnée
    this.biereService.addNote(this.newNotes).subscribe({
      next: (note) => {
        this.notes.push(this.newNotes);
        this.user.nb_notes = this.notes.length;
        const dateSelected = this.newNotes.date;
        this.newNotes = new NoteBiere();
        this.newNotes.date = dateSelected;
        this.userService.updateUser(this.user);
      },
      error: (err) => {
        console.error("Erreur lors de l'ajout de la note:", err);
      },
    });
  }

  onBiereChange(newBiere: string): void {
    this.selectedBiere = newBiere; // Met à jour la valeur de selectedPersonne
    console.log('Personne sélectionnée :', this.selectedBiere);
  }

  editer() {
    this.router.navigate(['/personnes/edit/' + this.user.id]);
  }

  onDelete() {
    confirm('Impossible pour le moment');
  }
}
