import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDoc, DocumentReference, Query, query, where, orderBy, serverTimestamp, addDoc, CollectionReference } from '@angular/fire/firestore';
import { Goal } from '../interfaces/goal';
import { Observable, firstValueFrom } from 'rxjs';
import { INotification } from '../interfaces/i-notification';
import { IUser } from '../interfaces/i-user';
import { setDoc } from '@angular/fire/firestore';
import { Discussion } from '../interfaces/discussion';
import { DbIdea, Idea } from '../interfaces/idea';

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
  async getIdea(id: string): Promise<Idea> {
    let ideaDoc = doc(this.firestore, `ideas/${id}`);
    return this._getDocument<Idea>(ideaDoc, this._convertDbIdea);
  }

  async postIdea(title: string, content: string, goalIds: string[], authorId: string): Promise<Idea> {
    let payload = {
      content: content,
      title: title,
      goalIds: goalIds,
      date: serverTimestamp(),
      upvotes: 0,
      authorId: authorId,
    };
    return this._postDocument<Idea>(this.ideaCollection, payload);
  }

  async getGoal(id: string): Promise<Goal> {
    return this._getDocument(doc(this.firestore, `goals/${id}`));
  }

  async getIdeasOfGoal(goalId: string, orderByField: string): Promise<Idea[]> {
    let iquery = query(
      this.ideaCollection, 
      where("goalIds", "array-contains", goalId), 
      orderBy(orderByField, "desc"),
    );
    return this._getCollection<Idea>(iquery, this._convertDbIdea);
  }

  async getIdeas(orderByField: string): Promise<Idea[]> {  
    let iquery = query(this.ideaCollection, orderBy(orderByField, "desc"));
    return this._getCollection<Idea>(iquery, this._convertDbIdea);
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

  // db -> obj
  // --------------------------------------------
  async _convertDbIdea(dbIdea: DbIdea): Promise<Idea> {
    return new Promise(async (resolve, reject) => {
      let author = await this.getUser(dbIdea.authorId);
      if (!author) {
        reject(`User ${dbIdea.authorId} not found`);
        return;
      }      
      let {authorId, ...validFields} = dbIdea;
      resolve({...validFields, author: author});
    });
  }

  // utilities
  // --------------------------------------------
  async _setDocument<T>(idocument: DocumentReference, payload: any): Promise<T> {
    await setDoc(idocument, payload);
    return { ...payload, id: idocument.id } as T;
  }

  async _postDocument<T>(icollection: CollectionReference, payload: any): Promise<T> {
    let doc = await addDoc(icollection, payload);
    return { ...payload, id: doc.id } as T;
  }

  async _exists(doc: DocumentReference): Promise<boolean> {
    let docRef = await getDoc(doc);
    return docRef.exists();
  }

  async _getCollection<U>(icollection: Query, converter: ((dbData: any) => Promise<U>) | undefined = undefined): Promise<U[]> {
    let data$ = collectionData(icollection, {idField: "id"});
    let dbData = await firstValueFrom(data$);
    if (!converter) {
      return dbData as U[];
    }
    let data = await Promise.all(dbData.map((d) => converter.call(this, d)));
    return data;
  }

  async _getDocument<U>(idocument: DocumentReference, converter: ((dbData: any) => Promise<U>) | undefined = undefined): Promise<U> {
    return new Promise(async (resolve, reject) => {
      let data$ = docData(idocument, {idField: "id"});
      let dbData = await firstValueFrom(data$);
      if (!dbData) {
        reject(`document ${idocument.path} not found`);
        return;
      }
      if (!converter) {
        resolve(dbData as U);
        return;
      }
      let data = await converter.call(this, dbData);
      resolve(data);
      return; 
    });
  }

  _streamCollection<T>(icollection: Query): Observable<T[]> {
    return collectionData(icollection, {idField: "id"}) as Observable<T[]>;
  }

  _streamDocument<T>(idocument: DocumentReference): Observable<T> {
    return docData(idocument, {idField: "id"}) as Observable<T>;
  }
}
