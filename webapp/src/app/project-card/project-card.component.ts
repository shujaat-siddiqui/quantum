import { ElementRef, Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Expertise, Project, Skill } from '../model/project';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {

  @Input() public project:Project;
  @ViewChild('project-description') el:ElementRef;

  description_data:Boolean = false;

  expertise:Expertise;
  skills:Skill;
  skillsString: String;

  constructor(private router: Router) { }

  ngOnInit(): void {
    
    //this.overflown();
    let endDate = new Date(this.project.startDate);
    endDate.setDate(endDate.getDate() + (this.project.durationInWeeks * 7));
    this.project.endDate = endDate;
  }
  getColor(projectStatus) { (2)
    switch (projectStatus) {
      case 'ONGOING':
        return 'orange';
      case 'COMPLETED':
        return 'green';
      case 'NOT_STARTED':
        return 'red';
    }
  }
  createTeam(value){
   this.router.navigate(["/dashboard/createteam",value]);
  }

  viewProject(projectId){
    this.router.navigate(["/dashboard/projects",projectId]);
  }

  skillString()
  {
    this.skillsString = new String();
    for(this.expertise of this.project.expertise)
    {
      for(this.skills of this.expertise.skills)
      {
        if(this.skillsString.includes(String(this.skills.skillName))){}
        else
        {
          this.skillsString = String(this.skillsString) + this.skills.skillName+", ";
        }
      }
    }
    this.skillsString= this.skillsString.substring(0, this.skillsString.length-2);
    return this.skillsString;

  }




}
