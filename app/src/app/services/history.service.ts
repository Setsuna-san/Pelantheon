import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private maxHistorySize = 3;
  private historyKey = 'navigationHistory';

  constructor(
    private route: ActivatedRoute

  ) {}

  addToHistory(url: string): void {
    if (this.route.snapshot.queryParams['b'] == 1) {
      return;
    }
    const history = this.getHistory();
    history.push(url);

    // Garder uniquement les 3 dernières pages
    if (history.length > this.maxHistorySize) {
      history.shift();
    }

    sessionStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  getHistory(): string[] {
    const history = sessionStorage.getItem(this.historyKey);
    return history ? JSON.parse(history) : [];
  }

  getPreviousPage(): string {
    const history = this.getHistory();
    history.pop() ;
    sessionStorage.setItem(this.historyKey, JSON.stringify(history));
    return history[history.length - 1];
  }
}
