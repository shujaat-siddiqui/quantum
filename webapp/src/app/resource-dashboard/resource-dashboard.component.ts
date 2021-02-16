import { Component, OnInit, Renderer2 } from '@angular/core';
import { Project } from '../model/project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-resource-dashboard',
  templateUrl: './resource-dashboard.component.html',
  styleUrls: ['./resource-dashboard.component.css']
})
export class ResourceDashboardComponent implements OnInit {
  slideIndex = 0;
  aiArray;
  arrayUpdated: boolean = false;
  public datachunk: any = [];
  temp: Project[];
 pdisabled=false;
 ndisabled=true;


  constructor(private renderer: Renderer2,private projectService: ProjectService) { }
  projects: Array<Project> = new Array<Project>();

  ngOnInit(): void {

    this.projectService.getProjectDetails().subscribe(response => {
      console.log(response);
      this.temp=response;
      this.datachunk = this.getChunks(this.temp, 3);
      this.arrayUpdated = true;
      console.log(this.getChunks(this.temp, 3));
      this.projects =  this.datachunk[this.slideIndex]; 
     
    },
      error => {
        console.log(error);
      });
     

      let endDate = new Date(this.datachunk.startDate);
    endDate.setDate(endDate.getDate() + (this.datachunk.durationInWeeks * 7));
    this.datachunk.endDate = endDate;

  }

  nextslide(){
    this.slideIndex=Math.abs((this.slideIndex+1)%this.datachunk.length);
    console.log(this.slideIndex);
    this.projects =  this.datachunk[this.slideIndex];

  if(this.slideIndex==0){
this.pdisabled=false;
  }
  else{
    this.pdisabled=true;
  }

  if(this.slideIndex!=((this.datachunk.length)-1)){
    this.ndisabled=true;
      }
      else{
        this.ndisabled=false;
      }

  }

  previousslide(){
    this.slideIndex =Math.abs((this.slideIndex-1)%this.datachunk.length);
    console.log(this.slideIndex,this.datachunk.length);
    this.projects =  this.datachunk[this.slideIndex];

    if(this.slideIndex!=((this.datachunk.length)-1)){
      this.ndisabled=true;
        }
        else{
          this.ndisabled=false;
        }
        if(this.slideIndex==0){
          this.pdisabled=false;
            }
            else{
              this.pdisabled=true;
            }
      }
 
  getChunks(arr, size) {
    let chunkarray = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkarray.push(arr.slice(i, i + size));
    }
    return chunkarray;
  }

  
}
