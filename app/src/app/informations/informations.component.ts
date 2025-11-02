import { Component, OnInit } from '@angular/core';
import { BiereService } from '../services/biere.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Biere, NoteBiere } from '../models/biere';
import { User } from '../models/user';
import { Etatload } from '../models/etatload';

interface UserRanking {
  id: string;
  nom: string;
  nbNote: number;
  note: number;
  top: number;
  topNom: string;
  worst: number;
  worstNom: string;
}

interface BeerRanking {
  id: string;
  nom: string;
  nbNote: number;
  note: number;
  top: number;
  topNom: string;
  worst: number;
  worstNom: string;
}

@Component({
  selector: 'app-informations',
  templateUrl: './informations.component.html',
  styleUrls: ['./informations.component.css'], // ⚠️ 'styleUrls' au pluriel
  standalone: false,
})
export class InformationsComponent implements OnInit {
  constructor(
    private biereService: BiereService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  public rankedUsers: UserRanking[] = [];
  public rankedBeers: BeerRanking[] = [];
  public empty: UserRanking[] = [];
  public notes: NoteBiere[] = []; // Liste des notes
  public moyenneNotes: number = 0; // Liste des notes

  public users: User[] = [];
  public usersById: { [id: string]: User } = {}; // Index des utilisateurs par ID

  public bieres: Biere[] = [];
  public bieresById: { [id: string]: Biere } = {}; // Index des bieres par ID

  public etatLoad: Etatload = Etatload.LOADING;
  public etatUserRanking: Etatload = Etatload.LOADING;
  public etatBeerRanking: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  // filtre du classements des utilisateur par année
  public periodeUser: string = '';

  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.biereService.getNotes().subscribe({
      next: (notes) => {
        notes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.notes = notes;

        if (this.notes && this.notes.length !== 0) {
          let total = this.notes.reduce((sum, n) => sum + n.note, 0);
          this.moyenneNotes = Math.round((total / this.notes.length) * 10) / 10;
        }

        this.etatLoad = Etatload.SUCCESS;

        // récuperation des utilisateurs
        this.userService.getUsers().subscribe({
          next: (users) => {
            this.users = users;
            this.usersById = this.userService.indexUsersById(users); // Indexation des utilisateurs

            // récuperation des bières
            this.biereService.getBieres().subscribe({
              next: (bieres) => {
                this.bieres = bieres;
                this.bieresById = this.biereService.indexBieresById(bieres); // Indexation des utilisateurs
                this.rankUsers();
              },
              error: (err) => (this.etatBeerRanking = Etatload.ERREUR),
            });
          },
          error: (err) => {
            this.etatLoad = Etatload.ERREUR;
            this.etatUserRanking = Etatload.ERREUR;
            console.error(
              'Erreur lors de la récupération des utilisateurs:',
              err
            );
          },
        });
      },
      error: (err) => {
        this.etatLoad = Etatload.ERREUR;
        console.error('Erreur lors de la récupération des bières:', err);
      },
    });
  }

  rankUsers() {
    this.etatUserRanking = Etatload.LOADING;
    this.etatBeerRanking = Etatload.LOADING;

    // Index temporaire des classements utilisateurs
    const indexRankedUsers: { [id: string]: UserRanking } = {};
    const indexRankedBeer: { [id: string]: BeerRanking } = {};

    // Filtrage des notes selon l’année si besoin
    const filteredNotes = this.notes.filter((note) => {
      const noteYear = new Date(note.date).getFullYear().toString();
      return this.periodeUser === '' || noteYear === this.periodeUser;
    });

    // Parcours des notes pour construire les statistiques
    filteredNotes.forEach((note) => {
      const userId = note.userId; // 🔧 à adapter selon ton modèle
      const biereId = note.biereId; // 🔧 à adapter selon ton modèle
      const user = this.usersById[userId];
      const beer = this.bieresById[note.biereId]; // 🔧 à adapter aussi

      // Si utilisateur inconnu, on saute
      if (user) {
        // Si utilisateur pas encore dans le classement → initialiser
        if (!indexRankedUsers[userId]) {
          indexRankedUsers[userId] = {
            id: userId,
            nom: user.surnom ?? 'Utilisateur inconnu', // 🔧 champ de test
            nbNote: 0,
            note: 0,
            top: 0,
            topNom: '',
            worst: 0,
            worstNom: '',
          };
        }
        const rank = indexRankedUsers[userId];
        // récuperation du total des notes
        rank.note *= rank.nbNote;
        // 🔢 Mise à jour du cumul
        rank.nbNote++;
        rank.note += note.note;
        // reconversion en moyenne
        rank.note = Math.round((rank.note / rank.nbNote) * 10) / 10;
        // Meilleure bière
        if (!rank.top || note.note > rank.top) {
          rank.top = note.note;
        }
        // Pire note
        if (!rank.worst || note.note < rank.worst) {
          rank.worst = note.note;
        }
      }

      if (beer) {
        if (!indexRankedBeer[biereId]) {
          indexRankedBeer[biereId] = {
            id: biereId,
            nom: beer.nom ?? 'Biere inconnue', // 🔧 champ de test
            nbNote: 0,
            note: 0,
            top: 0,
            topNom: '',
            worst: 0,
            worstNom: '',
          };
        }
        const rank = indexRankedBeer[biereId];
        // récuperation du total des notes
        rank.note *= rank.nbNote;
        // 🔢 Mise à jour du cumul
        rank.nbNote++;
        rank.note += note.note;
        // reconversion en moyenne
        rank.note = Math.round((rank.note / rank.nbNote) * 10) / 10;
        // Meilleure bière
        if (!rank.top || note.note > rank.top) {
          rank.top = note.note;
        }
        // Pire note
        if (!rank.worst || note.note < rank.worst) {
          rank.worst = note.note;
        }
      }
    });

    this.rankedUsers = Object.values(indexRankedUsers);
    this.rankedBeers = Object.values(indexRankedBeer);

    // 6️⃣ (Optionnel) Tri par moyenne descendante
    this.rankedUsers.sort((a, b) => b.nbNote - a.nbNote);
    this.rankedBeers.sort((a, b) => b.note - a.note);
    this.etatBeerRanking = Etatload.SUCCESS;
    this.etatUserRanking = Etatload.SUCCESS;
  }
}
