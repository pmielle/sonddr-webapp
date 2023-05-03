import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDoc, DocumentReference, Query, query, where, orderBy } from '@angular/fire/firestore';
import { Goal } from '../interfaces/goal';
import { Observable, firstValueFrom } from 'rxjs';
import { INotification } from '../interfaces/i-notification';
import { IUser } from '../interfaces/i-user';
import { setDoc } from '@angular/fire/firestore';
import { Discussion } from '../interfaces/discussion';
import { Idea } from '../interfaces/idea';

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
  ideaCollection = collection(this.firestore, "ideas");

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // methods
  // --------------------------------------------
  async getGoal(id: string): Promise<Goal> {
    return this._getDocument(doc(this.firestore, `goals/${id}`));
  }

  async getIdeasOfGoal(goalId: string, orderByField: string): Promise<Idea[]> {
    return this._getCollection(query(
      this.ideaCollection, 
      where("goalIds", "array-contains", goalId), 
      orderBy(orderByField, "desc"),
    ));
  }

  async getIdeas(orderByField: string): Promise<Idea[]> {    
    return this._getCollection(query(this.ideaCollection, orderBy(orderByField, "desc")));
  }

  async getUser(id: string): Promise<IUser|undefined> {
    let userDoc = doc(this.firestore, `users/${id}`);
    if (await this._exists(userDoc)) {
      return this._getDocument<IUser>(userDoc);
    } else {
      return Promise.resolve(undefined);
    }
  }

  async createUser(id: string, name: string): Promise<IUser> {
    let userDoc = doc(this.firestore, `users/${id}`);
    let payload = { name: name };    
    return this._setDocument<IUser>(userDoc, payload);
  }

  getDiscussions(userId: string): Observable<Discussion[]> {
    return this._streamCollection<Discussion>(query(collection(this.firestore, `discussions`), where("userIds", "array-contains", userId)));
  }

  getNotifications(userId: string): Observable<INotification[]> {
    return this._streamCollection<INotification>(collection(this.firestore, `users/${userId}/notifications`));
  }

  async getGoals(): Promise<Goal[]> {
    return this._getCollection<Goal>(query(this.goalCollection, orderBy("order", "asc")));
  }

  // utilities
  // --------------------------------------------
  async _setDocument<T>(idocument: DocumentReference, payload: any): Promise<T> {
    await setDoc(idocument, payload);
    return { ...payload, id: idocument.id } as T;
  }

  async _exists(doc: DocumentReference): Promise<boolean> {
    let docRef = await getDoc(doc);
    return docRef.exists();
  }

  async _getCollection<T>(icollection: Query): Promise<T[]> {
    let data$ = collectionData(icollection, {idField: "id"});
    return await firstValueFrom(data$) as T[];
  }

  async _getDocument<T>(idocument: DocumentReference): Promise<T> {
    let data$ = docData(idocument, {idField: "id"});
    return await firstValueFrom(data$) as T;
  }

  _streamCollection<T>(icollection: Query): Observable<T[]> {
    return collectionData(icollection, {idField: "id"}) as Observable<T[]>;
  }

  _streamDocument<T>(idocument: DocumentReference): Observable<T> {
    return docData(idocument, {idField: "id"}) as Observable<T>;
  }
}
