import { getLocaleDateFormat } from '@angular/common';

export class Biere {
  constructor(
    public id: string = '',
    public nom: string = '',
    public alcool: number = 0.0,
    public ean: string = '',
    public imgUrl: string = '',
    public type: string = '',
    public note: number = 0.0,
    public nb_notes: number = 0.0
  ) {}
}

export class NoteBiere {
  constructor(
    public id: string = '',
    public note: number = 0,
    public commentaire: string = '',
    public date: string | Date = new Date().toLocaleDateString('fr-FR'),
    public biereId: string = '',
    public userId: string = ''
  ) {}
}

export const TypeBiere = [
  'AMBREE',
  'BLANCHE',
  'BLONDE',
  'BRUNE',
  'IPA',
  'NEIPA',
  'RED ALE',
  'STOUT',
  'TEQUILA',
  'TRIPLE',
  'AUTRE',
] as const;

export type TypeBiereType = (typeof TypeBiere)[number];
