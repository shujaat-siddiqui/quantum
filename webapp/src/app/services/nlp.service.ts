import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NlpService {

  URL = environment.BASE_URL+"nlp-service/api/v1/"
  constructor(private http: HttpClient) { }

  searchProjects(keyWord:string)
  {
    return this.http.get<any>(this.URL+"nlp/search",{
      params: {
        input: keyWord
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
