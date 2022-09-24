import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url: string = 'http://localhost:3000/';

  constructor(private readonly http: HttpClient, private router: Router) {}

  public sign(payload: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.url}sign`, payload).pipe(
      map((data) => {
        localStorage.removeItem('access_token');
        localStorage.setItem('access_token', JSON.stringify(data.token));
        this.router.navigate(['admin']);
      }),
      catchError((err) =>
        throwError(() =>
          err.error.message
            ? err.error.message
            : 'No momento não estamos conseguindo validar estes dados, tente novamente mais tarde.'
        )
      )
    );
  }

  public logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }
}
