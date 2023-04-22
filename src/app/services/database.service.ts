import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Goal } from '../interfaces/goal';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // dependencies
  // --------------------------------------------
  firestore = inject(Firestore);
  
  // attributes
  // --------------------------------------------
  goalCollection = collection(this.firestore, "goals");

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // methods
  // --------------------------------------------
  async getGoals(): Promise<Goal[]> {
    let data$ = collectionData(this.goalCollection);
    let data = await firstValueFrom(data$) as Goal[];
    return data;
  }
}
