import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Biere, NoteBiere } from 'src/app/models/biere';
import { Etatload } from 'src/app/models/etatload';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { BiereService } from 'src/app/services/biere.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  standalone: false,
})
export class NoteListComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private biereService: BiereService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}
  public notes: NoteBiere[] = []; // Liste des bières
  users: User[] = [];
  usersById: { [id: string]: User } = {}; // Index des utilisateurs par ID

  bieres: Biere[] = [];
  bieresById: { [id: string]: Biere } = {}; // Index des bieres par ID

  public etatLoad: Etatload = Etatload.LOADING;
  public Etatload = Etatload;

  public searchCriteria = {
    nom: '',
    type: '',
    note: null as number | null,
  };

  private allNotes: NoteBiere[] = []; // Liste complète des bières pour conserver les données originales

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    // Initialisation de la liste des bières
    this.biereService.getNotes().subscribe({
      next: (notes) => {
        notes.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.allNotes = notes;
        this.notes = notes;

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
                this.etatLoad = Etatload.SUCCESS;
              },
              error: (err) => (this.etatLoad = Etatload.ERREUR),
            });
          },
          error: (err) => {
            this.etatLoad = Etatload.ERREUR;

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

  sortTable(column: keyof NoteBiere) {
    // Utilisez 'keyof Note' pour restreindre les colonnes triables
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

  timeSince(date: string | Date): string {
    const now = new Date();
    const past = typeof date === 'string' ? new Date(date) : date;
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) return `${seconds} sec`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} j`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} mois`;
    const years = Math.floor(months / 12);
    return `${years} an${years > 1 ? 's' : ''}`;
  }

  public delete(id: number) {}

  reloadPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.route.snapshot.url.join('/')]);
    });
  }
}
