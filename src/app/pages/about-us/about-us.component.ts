import { Component, OnInit } from '@angular/core';
// import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  teamsList:any;
  constructor() { }

  ngOnInit() {

    this.teamsList = [
      {image:'assets/Team/person.jpeg',person_name:'Jitendra Jain',Designation:'Chief executive officer',about_me:"I am CEO of this firm."},
      {image:'assets/Team/person.jpeg',person_name:'Jitendra Jain',Designation:'Managing director',about_me:"Test Test"},
      {image:'assets/Team/person.jpeg',person_name:'Jitendra Jain',Designation:'CEO',about_me:"Test Test"},
      {image:'assets/Team/person.jpeg',person_name:'Jitendra Jain',Designation:'CEO',about_me:"Test Test"},

    ]
    window.scroll(0,0)
  }

}
