
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {

  constructor(private projectService : ProjectService, private activateRoute: ActivatedRoute, private router : Router ) { }
  
  projectId : string;

  project: any;
  isProjectLoaded : boolean = false;
  isTeamFormed: boolean = true;
  startDate : any;
  endDate : any;
  statusIcon : any;
  statusColor : any;

  panelOpenState = false;

  projectImage = "../assets/images/project.jpg";
  resourceImage = "../assets/images/resource.jpg";

  ngOnInit(): void {
    this.projectId = this.activateRoute.snapshot.params.projectId;
    this.getProject();
  }

  getProject(){
    this.projectService.getProjectDetail(this.projectId)
    .subscribe(response => {
      console.log(response);
      this.project = response['body'];
      console.log(this.project);
      this.isTeamFormed = this.project.teamCreated; 
      this.setDates();
      this.setStatusIcon();      
      this.isProjectLoaded = true; 
    }),error => {
      console.log(error);
    }
  } 

  setDates(){
    this.startDate = new Date(this.project.startDate).toDateString();
    this.endDate = new Date(this.project.startDate);
    this.endDate.setDate(this.endDate.getDate() + (this.project.durationInWeeks * 7));
    this.endDate = this.endDate.toDateString();
  }

  setStatusIcon(){
    if(this.project.projectStatus == "ONGOING"){
      this.statusIcon = "integration_instructions";
      this.statusColor = "yellow";
    }
    else if(this.project.projectStatus == "COMPLETED"){
      this.statusIcon = "check_circle";
      this.statusColor = "green";
    }
    else{
      this.statusIcon = "pending_actions";
      this.statusColor = "white";
    }
  }

  createTeam(){
    this.router.navigate(['/dashboard/createteam/' + this.projectId]);
  }

  /**For Testing purposes **/

  // getProject(){
  //   this.httpClient.get('http://localhost:3000/projects')
  //   .subscribe(response => {
  //     console.log(response);
  //     this.project = response[0];
  //     console.log(this.project);
  //     this.isProjectLoaded = true; 
  //     this.isTeamFormed = this.project.teamCreated; 
  //     this.setDates();
  //     this.setStatusIcon();
  //   }),error => {
  //     console.log(error);
  //   }
  // }
    



}
