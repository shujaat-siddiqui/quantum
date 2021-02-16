import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  URL = environment.BASE_URL+"project-service/api/v1/";
  constructor(private httpClient: HttpClient,private tokenService: TokenService) { }

  getProjectDetails()
  {
    return this.httpClient.get<Project[]>(this.URL+'projects', {
      params: {
        // managerEmail:this.tokenService.getUser()
        //managerEmail:"venkat@tsymphony.in"
      }
    }).pipe(catchError(this.errorHandler));
  }

  getProjectDetail(projectId){
    return this.httpClient.get<Project>(this.URL+'project', {params: {["projectId"] : projectId}, observe: "response"})
      .pipe(catchError(this.errorHandler));
  }

  postProjectDetails(project: Project)
  {
    return this.httpClient.post(this.URL+'project', project).pipe(catchError(this.errorHandler));
  }

  updateProject(projectId, project : Project){
    return this.httpClient.put(this.URL + "project/" + projectId, project).pipe(catchError(this.errorHandler));
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
