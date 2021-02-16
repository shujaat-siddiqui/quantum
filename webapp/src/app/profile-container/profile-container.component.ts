import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { Resource } from '../model/resource';
import {ProfileCardServiceService} from '../services/profile-card-service.service';
@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css']
})
export class ProfileCardContainerComponent implements OnInit {

  
  public resources: Array<Resource>;
  public backEndDev: Array<Resource>;
  public testing:Array<Resource>
  public frontEndDev:Array<Resource>
  projectDetails: Project;
  tempResources: Resource;
  temp1:any;

  @Input() public project:Project;

  constructor(private profileCardService : ProfileCardServiceService) { }

  ngOnInit(): void {
    this.profileCardService.getProfile().subscribe(response => {
      console.log(response);
      this.resources = response;

      this.getProfileByDesignation()
      // this.splitIntoChunk(this.frontEndDev,2)
      
    },
      error => {
        console.log(error);
      });

      this.profileCardService.getProjectDetails().subscribe(response1=>{
        console.log(response1);
        this.projectDetails=response1[0];
      },
      error => {
        console.log(error);
      });

      let endDate = new Date(this.projectDetails.startDate);
      endDate.setDate(endDate.getDate() + (this.projectDetails.durationInWeeks * 7));
      this.projectDetails.endDate = endDate; 

  }

  getProfileByDesignation(){
   
    this.frontEndDev =  this.resources.filter(function(resource)
     {
      return resource.designation == "Front End Dev";
  });
  this.backEndDev =  this.resources.filter(function(resource)
     {
      return resource.designation == "Back End Dev";
  });
  this.testing =  this.resources.filter(function(resource)
     {
      return resource.designation == "Testing";
  });
  console.log(this.frontEndDev);
  console.log(this.backEndDev);
  console.log(this.testing);
  }

  getColor(projectStatus) { (2)
    switch (projectStatus) {
      case 'ONGOING':
        return 'orange';
      case 'COMPLETED':
        return 'green';
      case 'NOT STARTED':
        return 'red';
    }
  }

  

// onRemoveProfile(event) {
//       const index = event.email;
//       console.log('Delete profile');
//       for (let i = 0; i < this.resources.length; i++) {
//           if (this.resources[i].email === index) {
//               this.resources.splice(i, 1);
//       }

//   }
// }
// getNextResource(){
//     var i=2
//     this.frontEndDev[i+1]=this.tempResources;
//     console.log(this.tempResources);  
// }

// program to split array into smaller chunks

//  splitIntoChunk(arr, chunk) {

//   for ( var i=0; i < this.frontEndDev.length; i += chunk) {

//       let tempArray;
//       tempArray = this.frontEndDev.slice(i, i + chunk);
//       // console.log(tempArray);
//       this.temp1=tempArray;
//       console.log(this.temp1);
//   }

// }
}
