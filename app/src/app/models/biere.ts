import { getLocaleDateFormat } from '@angular/common';

export class Biere {
  constructor(
    public id: number = 0,
    public nom: string = '',
    public alcool: number = 0.0,
    public type: string = "",
    public note: number = 0.0,
    public nb_notes: number = 0.0,
  ) {}
}

export class NoteBiere {
  constructor(
    public id: number = 0,
    public note: number = 0,
    public commentaire: string = '',
    public date: String | Date = new Date().toLocaleDateString('fr-FR'),
    public biereId: number = 0
  ) {}
}

export enum TypeBiere {
  'blanche',
  'ambrée',
  'brune',
  'blonde',
  'rouge',
  'noire',
  'fruitée',
  'épice',
  'herbe',
  'autre'
}


