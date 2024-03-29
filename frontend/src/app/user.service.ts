import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './user';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class UserService {

  private url = 'http://localhost:3009/users'; 
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getUserByNickname(username: string): Observable<User[]> {
    const url = `${this.url}/nick/${username}`;
    return this.http.get<User[]>(url).pipe(tap(_ => catchError(this.handleError<User>(`getUser username=${username}`))));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUser(id: string): Observable<User> {
    const url = `${this.url}/${id}`;
    return this.http.get<User>(url);
  }

  getFavouritePosts(id : string): Observable<Post[]> {
    const url = `${this.url}/favourites/`+id;
    return this.http.get<Post[]>(url);
  }

  getLikesPosts(id : string): Observable<Post[]> {
    const url = `${this.url}/likes/`+id;
    return this.http.get<Post[]>(url);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => { console.error(error);
      return of(result as T);
    };
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.url, user, this.httpOptions).pipe(
      tap((user: User) => console.log(`added user w/ id=${user}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }
  update(user: User): Observable<User> {
    const url = `${this.url}/${user._id}`;
    return this.http.put<User>(url, user, this.httpOptions).pipe(
      tap((user: User) => console.log(`added user w/ id=${user}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

  
}
