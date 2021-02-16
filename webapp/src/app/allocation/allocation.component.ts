import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Expertise, Project } from '../model/project';
import { Resource } from '../model/resource';
import { UserProfile } from '../model/user-profile';
import { ProjectService } from '../services/project.service';
import { ResourceAllocationService } from '../services/resource-allocation.service';
import { UserprofileService } from '../services/userprofile.service';
import { TeamDialogComponent } from '../team-dialog/team-dialog.component';

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit {

  expertiseArray: any;
  allocatedResources: Array<Resource> = new Array<Resource>()
  resourcesConfirmed: Array<UserProfile>;
  project: Project;
  recommendedResources: any;
  projectId: string;

  expertises: Array<Expertise> = new Array;
  resourcesSelected: Array<Resource> = new Array;

  panelOpenState = false;
  isProjectLoaded: boolean = false;
  isResourcesLoaded: boolean = false;
  isError: boolean = false;
  startDate: any;
  endDate: any;
  statusIcon: any;
  statusColor: any;
  projectImage = "../assets/images/project.jpg";
  resourceImage = "../assets/images/resource.jpg";
  constructor(private httpClient: HttpClient, private userProfileService: UserprofileService, public dialog: MatDialog,
    private projectService: ProjectService, private resourceAllocationService: ResourceAllocationService, private activateRoute: ActivatedRoute) { }


  ngOnInit(): void {

    // this.httpClient.get('http://localhost:8000/expertise').subscribe(
    //     data => {
    //       console.log('expertise', data);
    //       this.expertiseArray = data;
    //     });
    this.projectId = this.activateRoute.snapshot.params.projectId;
    this.getProject();
  }
  getProject() {
    this.projectService.getProjectDetail(this.projectId)
      .subscribe(response => {
        this.project = response['body'];
        console.log(this.project);
        this.setDates();
        this.setStatusIcon();
        this.isProjectLoaded = true;
        this.getResources();
      }), error => {
        console.log(error);
      }
  }

  setDates() {
    this.startDate = new Date(this.project.startDate).toDateString();
    this.endDate = new Date(this.project.startDate);
    this.endDate.setDate(this.endDate.getDate() + (this.project.durationInWeeks * 7));
    this.endDate = this.endDate.toDateString();
  }

  getResources() {
    this.resourceAllocationService.getSuggestedUsers(this.project)
      .subscribe(response => {
        console.log(response);
        this.expertiseArray = response;
        console.log(this.expertiseArray);
        // this.getExpertise();
        this.isResourcesLoaded = true;
        // console.log(this.expertises);
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

  setStatusIcon() {
    if (this.project.projectStatus == "ONGOING") {
      this.statusIcon = "integration_instructions";
      this.statusColor = "yellow";
    }
    else if (this.project.projectStatus == "COMPLETED") {
      this.statusIcon = "check_circle";
      this.statusColor = "green";
    }
    else {
      this.statusIcon = "pending_actions";
      this.statusColor = "white";
    }
  }


  deleteDev(i, j) {
    this.expertiseArray[i].resourcesSuggested.splice(j, 1);
  }

  onSubmit() {

    this.allocatedResources = new Array<Resource>()
    for (var i = 0; i < this.expertiseArray.length; i++) {
      // this.expertiseArray[i].noOfResources
      for (var j = 0; j < (this.expertiseArray[i].noOfResources) / 3; j++) {
        this.allocatedResources.push(this.expertiseArray[i].resourcesSuggested[j])
      }

    }
    console.log(this.allocatedResources);

    this.resourcesConfirmed = new Array;
    for (var i = 0; i < this.allocatedResources.length; i++) {
      var email = this.allocatedResources[i].email;
      console.log(email);
      this.userProfileService.getProfileById(email)
        .subscribe(response => {
          var userProfile = response;
          console.log(userProfile);
          this.resourcesConfirmed.push(userProfile);
        }), error => {
          console.log(error);
        }
    }
    const dialogRef = this.dialog.open(TeamDialogComponent, {
      width: '1000px',
      data: {
        project: this.project,
        resources: this.resourcesConfirmed
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });


  }

  loadingResourcesSpinner() {
    if (this.isResourcesLoaded) {
      return false;
    }
    else if (this.isError) {
      return false;
    }
    else {
      return true;
    }
  }

  tryAgain() {
    console.log('finding again');
    this.isError = false;
    this.getResources();
  }
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

}
