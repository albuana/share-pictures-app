import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class PostService {

  private url = 'http://localhost:3009/posts'; 
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPosts(): Observable<Post[]> {
    console.log(this.http.get<Post[]>(this.url));
    return this.http.get<Post[]>(this.url);
  }

  getPost(id : string): Observable<Post> {
    const url = `${this.url}/${id}`;
    return this.http.get<Post>(url);
  }
  getRecentPosts(): Observable<Post[]> {
    const url = `${this.url}/recent`;
    return this.http.get<Post[]>(url);
  }
  getPostsByLikes(): Observable<Post[]> {
    const url = `${this.url}/likes`;
    return this.http.get<Post[]>(url);
  }
  getPostsByUser(id : string): Observable<Post[]> {
    const url = `${this.url}/user/${id}`;
    return this.http.get<Post[]>(url);
  }
  addPost(post: Post): Observable<Post> {
    console.log(post);
    return this.http.post<Post>(this.url, post, this.httpOptions).pipe(
      tap((post: Post) => console.log(`added post w/ id=${post}`)),
      catchError(this.handleError<Post>('addPost'))
    );
  }
  deletePost(id : string): Observable<Post[]>{
    const url = `${this.url}/${id}`;
    return this.http.delete<Post[]>(url);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => { console.error(error);
      return of(result as T);
    };
  }
  update(post: Post): Observable<Post> {
    const url = `${this.url}/${post._id}`;
    return this.http.put<Post>(url, post, this.httpOptions).pipe(
      tap((post: Post) => console.log(`added post w/ id=${post}`)),
      catchError(this.handleError<Post>('UpdatePost Error'))
    );
  }
  
}
