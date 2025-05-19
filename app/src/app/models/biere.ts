import { getLocaleDateFormat } from '@angular/common';

export class Biere {
  constructor(
    public id: string = "",
    public nom: string = '',
    public alcool: number = 0.0,
    public ean : string = "",
    public imgUrl : string = "",
    public type: string = "",
    public note: number = 0.0,
    public nb_notes: number = 0.0,
  ) {}
}

export class NoteBiere {
  constructor(
    public id: string = "",
    public note: number = 0,
    public commentaire: string = '',
    public date: String | Date = new Date().toLocaleDateString('fr-FR'),
    public biereId: string = "",
    public userId: string = "",
  ) {}
}

export const TypeBiere = [
  'NEIPA',
  'BLONDE',
  'AMBREE',
  'STOUT',
  'BLANCHE',
  'RED ALE',
  'IPA',
  'TEQUILA',
  'AUTRES'
] as const;

export type TypeBiereType = typeof TypeBiere[number];


