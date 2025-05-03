import { getLocaleDateFormat } from '@angular/common';

export class Pizza {
  constructor(
    public id: number = 0,
    public name: string = '',
    public description: string = '',
    public small_price: number = 0.0,
    public large_price: number = 0.0,
    public categorie: number = 0
  ) {}
}

export class Categorie {
  constructor(public id: number = 0, public name: string = '') {}
}

export class Boisson {
  constructor(
    public id: number = 0,
    public name: string = '',
    public quantite: number = 0,
    public price: number = 0.0,
    public commentaire: string = ''
  ) {}
}
