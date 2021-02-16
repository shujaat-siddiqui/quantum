import { Component, OnInit } from '@angular/core';
import {Resource} from '../model/resource';
import {ProfileCardServiceService} from '../services/profile-card-service.service';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})

export class ProfileCardComponent implements OnInit {

  public profileCards: Resource[] ;

  @Input() public profile:Resource;
  
  constructor(private profileCardService: ProfileCardServiceService) { }


  ngOnInit(): void {

 
  }
  
}
