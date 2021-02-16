import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DialogFlowService {

  URL = environment.BASE_URL+"dialogflow-service/api/v1/dialogflow/";


  constructor(private httpClient:HttpClient) { }



  getDialogFlow(message: String)
  { 
    return this.httpClient.get(this.URL+message, {responseType: 'text'});
  }
}
