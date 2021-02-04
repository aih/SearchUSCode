import { Component, OnInit } from '@angular/core';

export interface USCSection {
  title: string;
  section: string;
  cite: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {

  }
}
