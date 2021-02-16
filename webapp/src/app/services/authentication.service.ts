import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { TokenService } from './token.service';
import { catchError } from "rxjs/operators";
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  URL = environment.BASE_URL+"authentication-service/api/v1/"
  // URL = "http://localhost:8085/api/v1/";

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  loginUser(user: User) {
    return this.http.post(this.URL+"login", user).pipe(catchError(this.errorHandler));
  }

  getAction() {
    return this.http.get<any>(this.URL+"action", {
      params: {
        email: this.tokenService.getUser()
      }
    }).pipe(catchError(this.errorHandler));
  }

  public errorHandler(error: Response|any) {
    if (error instanceof ErrorEvent)
      {console.error("an error occured:",error.message );
    return throwError("something bad happened");
    }
    else{
      console.error( `backend returned code ${error.status},`+
      `body was:${error.message}`);
      return throwError(error);
    }
  }

}
