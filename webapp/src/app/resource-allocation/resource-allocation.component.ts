
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Expertise } from '../model/expertise';
import { Project } from '../model/project';
import { Resource } from '../model/resource';
import { UserProfile } from '../model/user-profile';
import { ProjectService } from '../services/project.service';
import { ResourceAllocationService } from '../services/resource-allocation.service';
import { UserprofileService } from '../services/userprofile.service';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';

@Component({
  selector: 'app-resource-allocation',
  templateUrl: './resource-allocation.component.html',
  styleUrls: ['./resource-allocation.component.css']
})
export class ResourceAllocationComponent implements OnInit {

  constructor(private httpClient : HttpClient, private projectService : ProjectService, 
    private userProfileService : UserprofileService, private activateRoute: ActivatedRoute, 
    public dialog: MatDialog, private resourceAllocationService: ResourceAllocationService) { }

  recommendedResources: any;
  projectId: string;
  project: Project;

  expertises: Array<Expertise> = new Array;
  resourcesSelected: Array<Resource> = new Array;
  resourcesConfirmed: Array<UserProfile>;

  panelOpenState = false;
  isProjectLoaded: boolean = false;
  isResourcesLoaded: boolean = false;
  isError : boolean = false;
  startDate: any;
  endDate: any;
  statusIcon: any;
  statusColor: any;
  projectImage = "../assets/images/project.jpg";
  resourceImage = "../assets/images/resource.jpg";

  ngOnInit(): void {
    this.projectId = this.activateRoute.snapshot.params.projectId;    
    this.getProject();
  }

  getProject(){
    this.projectService.getProjectDetail(this.projectId)
    .subscribe(response => {
      this.project = response['body'];
      console.log(this.project); 
      this.setDates();
      this.setStatusIcon();      
      this.isProjectLoaded = true; 
      this.getResources();
    }),error => {
      console.log(error);
    }
  } 

  getResources() {
    this.resourceAllocationService.getSuggestedUsers(this.project)
        .subscribe(response => {
          console.log(response);
          this.recommendedResources = response;
          console.log(this.recommendedResources);
          this.getExpertise();
          this.isResourcesLoaded = true;
          console.log(this.expertises);
        }, error => {
          console.log(error);
          this.isError = true;       
        });    
  }

  getExpertise() {    
    for (var i = 0; i < this.project.expertise.length; i++) {
      var expertise = new Expertise;
      expertise.designation = this.project.expertise[i].designation;
      expertise.noOfResources = this.project.expertise[i].noOfResources;
      this.expertises.push(expertise);
    }
  }

  getMax(designation){
    for(var i=0; i<this.expertises.length; i++){
      if(this.expertises[i].designation == designation){
        return this.expertises[i].noOfResources;
      }
    }
  }

  isDisabled(designation, resource: Resource) {
    var isAdded = false;
    for (var i = 0; i < this.resourcesSelected.length; i++) {
      if (this.resourcesSelected[i] == resource) {
        isAdded = true;
        break;
      }
    }
    if (isAdded) {
      return false;
    }

    for (var i = 0; i < this.expertises.length; i++) {
      if (this.expertises[i].designation == designation) {
        if (this.expertises[i].resourcesAllocated >= this.expertises[i].noOfResources) {
          return true;
        }
        else {
          return false;
        }
      }
    }
  }

  selectResource(resource: Resource) {
    console.log(resource);
    var isAdded: boolean = false;
    for (var i = 0; i < this.resourcesSelected.length; i++) {
      if (this.resourcesSelected[i] == resource) {
        isAdded = true;
        break;
      }
    }

    if (isAdded) {
      for (var i = 0; i < this.resourcesSelected.length; i++) {
        if (this.resourcesSelected[i] == resource) {
          this.resourcesSelected.splice(i, 1);
          break;
        }
      }

      for (var i = 0; i < this.expertises.length; i++) {
        if (this.expertises[i].designation == resource.designation) {
          this.expertises[i].resourcesAllocated -= 1;
          console.log('Resources for ' + this.expertises[i].designation + ': ' + this.expertises[i].resourcesAllocated);

        }
      }
    }
    else {
      this.resourcesSelected.push(resource);
      for (var i = 0; i < this.expertises.length; i++) {
        if (this.expertises[i].designation == resource.designation) {
          this.expertises[i].resourcesAllocated += 1;
          console.log('Resources for ' + this.expertises[i].designation + ': ' + this.expertises[i].resourcesAllocated);
        }
      }
    }
  }

  setDates() {
    this.startDate = new Date(this.project.startDate).toDateString();
    this.endDate = new Date(this.project.startDate);
    this.endDate.setDate(this.endDate.getDate() + (this.project.durationInWeeks * 7));
    this.endDate = this.endDate.toDateString();
  }

  setStatusIcon() {
    if (this.project.projectStatus == "ONGOING") {
      this.statusIcon = "integration_instructions";
      this.statusColor = "yellow";
    }
    else if (this.project.projectStatus == "COMPLETED") {
      this.statusIcon = "check_circle";
      this.statusColor = "green";
    }
    else{
      this.statusIcon = "pending_actions";
      this.statusColor = "white";
    }
  }

  createTeam(): void {
    var isAllSelected = true;
    for(var i=0; i<this.expertises.length; i++){
      if(this.expertises[i].resourcesAllocated < this.expertises[i].noOfResources){
        isAllSelected = false;
        break;
      }
    }

    if(isAllSelected){
      this.resourcesConfirmed = new Array;
      for(var i=0; i<this.resourcesSelected.length; i++){
        var email = this.resourcesSelected[i].email;
        this.userProfileService.getProfileById(email)
          .subscribe(response => {
            var userProfile = response;
            console.log(userProfile);
            this.resourcesConfirmed.push(userProfile);
          }), error =>{
            console.log(error);
          }
      }

      const dialogRef = this.dialog.open(TeamDialogComponent, {
        width: '1000px',
        data: {
          project : this.project,
          resources :  this.resourcesConfirmed
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else{
      alert('Please select Minimum resources required!');
    }    
  } 

  loadingResourcesSpinner(){
    if(this.isResourcesLoaded){
      return false;
    }
    else if(this.isError){
      return false;
    }
    else{
      return true;
    }
  }

  tryAgain(){
    console.log('finding again');
    this.isError = false;
    this.getResources();
  }
  

  /**For Testing purposes **/

  // getProject() {
  //   this.httpClient.get('http://localhost:3000/projects')
  //     .subscribe(response => {
  //       console.log(response);
  //       this.project = response[0];
  //       console.log(this.project);
  //       this.setDates();
  //       this.setStatusIcon();
  //       this.isProjectLoaded = true;
  //       this.getResources();
  //     }), error => {
  //       console.log(error);
  //     }
  // }

  // getResources(){    
  //   this.httpClient.get('http://localhost:8000/expertise')
  //     .subscribe(response => {
  //       this.recommendedResources = response;
  //       console.log(this.recommendedResources);
  //       this.getExpertise();
  //       this.isResourcesLoaded = true;
  //       console.log(this.expertises);
  //     }), error => {
  //       this.isError = true;
  //       console.log(error);
  //     }    
  // }


}
