import { getLocaleDateFormat } from '@angular/common';

export class User {
  constructor(
    public id: string = "",
    public nom: string = '',
    public prenom: string = '', // Correction du type
    public surnom: string = "",
  ) {}

  getFullName(): string {
    return `${this.prenom} ${this.nom}`;
  }
}


