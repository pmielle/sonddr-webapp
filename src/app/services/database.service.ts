import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getDoc, DocumentReference, Query, query, where, orderBy, serverTimestamp, addDoc, CollectionReference, updateDoc, increment, deleteDoc } from '@angular/fire/firestore';
import { Goal } from '../interfaces/goal';
import { Observable, firstValueFrom } from 'rxjs';
import { INotification } from '../interfaces/i-notification';
import { IUser } from '../interfaces/i-user';
import { setDoc } from '@angular/fire/firestore';
import { Discussion } from '../interfaces/discussion';
import { DbIdea, Idea } from '../interfaces/idea';
import { DbComment, IComment, CommentOrderBy } from '../interfaces/i-comment';
import { DbVote } from '../interfaces/upvote';

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
  commentCollection = collection(this.firestore, "comments");
  ideaUpvoteCollection = collection(this.firestore, "idea-upvotes");
  commentUpvoteCollection = collection(this.firestore, "comment-upvotes");

  // lifecycle hooks
  // --------------------------------------------
  constructor() { }

  // methods
  // --------------------------------------------
  async hasDownvotedComment(commentId: string, userId: string): Promise<boolean> {
    let voteId = this._makeVoteId(commentId, userId);
    let voteDoc = doc(this.firestore, `comment-downvotes/${voteId}`);
    return await this._exists(voteDoc);
  }

  async deleteCommentDownvote(commentId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(commentId, userId);
      let voteDoc = doc(this.firestore, `comment-downvotes/${voteId}`);
      // make sure that the downvote exists
      if (!await this._exists(voteDoc)) {
        reject(`Downvote ${voteId} does not`);
        return;
      }
      // update the comment
      let commentDoc = doc(this.firestore, `comments/${commentId}`);
      await this._updateDocument(commentDoc, { upvotes: increment(1) });
      // delete the downvote
      this._deleteDocument(voteDoc);
      resolve();
    });
  }

  async downvoteComment(commentId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(commentId, userId);
      let voteDoc = doc(this.firestore, `comment-downvotes/${voteId}`);
      // check that the downvote does not already exist
      if (await this._exists(voteDoc)) {
        reject(`Downvote ${voteId} already exist`);
        return;
      }
      // update the comment
      let commentDoc = doc(this.firestore, `comments/${commentId}`);
      await this._updateDocument(commentDoc, { upvotes: increment(-1) });
      // upload the downvote
      let payload = {
        commentId: commentId,
        userId: userId,
      };
      this._setDocument<DbVote>(voteDoc, payload);
      resolve();
    });
  }

  async hasUpvotedComment(commentId: string, userId: string): Promise<boolean> {
    let voteId = this._makeVoteId(commentId, userId);
    let voteDoc = doc(this.firestore, `comment-upvotes/${voteId}`);
    return await this._exists(voteDoc);
  }

  async deleteCommentUpvote(commentId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(commentId, userId);
      let voteDoc = doc(this.firestore, `comment-upvotes/${voteId}`);
      // make sure that the upvote exists
      if (!await this._exists(voteDoc)) {
        reject(`Upvote ${voteId} does not`);
        return;
      }
      // update the comment
      let commentDoc = doc(this.firestore, `comments/${commentId}`);
      await this._updateDocument(commentDoc, { upvotes: increment(-1) });
      // delete the upvote
      this._deleteDocument(voteDoc);
      resolve();
    });
  }

  async upvoteComment(commentId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(commentId, userId);
      let voteDoc = doc(this.firestore, `comment-upvotes/${voteId}`);
      // check that the upvote does not already exist
      if (await this._exists(voteDoc)) {
        reject(`Upvote ${voteId} already exist`);
        return;
      }
      // update the comment
      let commentDoc = doc(this.firestore, `comments/${commentId}`);
      await this._updateDocument(commentDoc, { upvotes: increment(1) });
      // upload the upvote
      let payload = {
        commentId: commentId,
        userId: userId,
      };
      this._setDocument<DbVote>(voteDoc, payload);
      resolve();
    });
  }

  async hasUpvotedIdea(ideaId: string, userId: string): Promise<boolean> {
    let voteId = this._makeVoteId(ideaId, userId);
    let voteDoc = doc(this.firestore, `idea-upvotes/${voteId}`);
    return await this._exists(voteDoc);
  }

  async deleteIdeaUpvote(ideaId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(ideaId, userId);
      let voteDoc = doc(this.firestore, `idea-upvotes/${voteId}`);
      // make sure that the upvote exists
      if (!await this._exists(voteDoc)) {
        reject(`Upvote ${voteId} does not`);
        return;
      }
      // update the idea
      let ideaDoc = doc(this.firestore, `ideas/${ideaId}`);
      await this._updateDocument(ideaDoc, { upvotes: increment(-1) });
      // delete the upvote
      this._deleteDocument(voteDoc);
      resolve();
    });
  }

  async upvoteIdea(ideaId: string, userId: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let voteId = this._makeVoteId(ideaId, userId);
      let voteDoc = doc(this.firestore, `idea-upvotes/${voteId}`);
      // check that the upvote does not already exist
      if (await this._exists(voteDoc)) {
        reject(`Upvote ${voteId} already exist`);
        return;
      }
      // update the idea
      let ideaDoc = doc(this.firestore, `ideas/${ideaId}`);
      await this._updateDocument(ideaDoc, { upvotes: increment(1) });
      // upload the upvote
      let payload = {
        ideaId: ideaId,
        userId: userId,
      };
      this._setDocument<DbVote>(voteDoc, payload);
      resolve();
    });
  }

  async getComments(ideaId: string, orderByField: CommentOrderBy): Promise<IComment[]> {    
    let iquery = query(
      this.commentCollection, 
      where("ideaId", "==", ideaId), 
      orderBy(orderByField, "desc"),
    );
    return this._getCollection(iquery, this._convertDbComment);
  }

  async postComment(content: string, ideaId: string, authorId: string): Promise<IComment> {
    let payload = {
      content: content,
      ideaId: ideaId,
      date: serverTimestamp(),
      upvotes: 0,
      authorId: authorId,
    };
    let dbComment = await this._postDocument<DbComment>(this.commentCollection, payload);
    return this._convertDbComment(dbComment);
  }

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
    let dbIdea = await this._postDocument<DbIdea>(this.ideaCollection, payload);
    return this._convertDbIdea(dbIdea);
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

  async getIdeasFromUser(userId: string, orderByField: string): Promise<Idea[]> {
    let iquery = query(
      this.ideaCollection, 
      where("authorId", "==", userId), 
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

  async _convertDbComment(dbComment: DbComment): Promise<IComment> {
    return new Promise(async (resolve, reject) => {
      let author = await this.getUser(dbComment.authorId);
      if (!author) {
        reject(`User ${dbComment.authorId} not found`);
        return;
      }      
      let {authorId, ...validFields} = dbComment;
      resolve({...validFields, author: author});
    });
  }

  // utilities
  // --------------------------------------------
  _makeVoteId(resourceId: string, userId: string): string{
    return `${resourceId}-${userId}`;
  }

  async _deleteDocument(idocument: DocumentReference): Promise<void> {
    deleteDoc(idocument);
  }

  async _updateDocument(idocument: DocumentReference, payload: any): Promise<void> {
    updateDoc(idocument, payload);
  }

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
