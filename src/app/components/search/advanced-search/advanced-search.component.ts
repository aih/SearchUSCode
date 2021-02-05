import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  fields = [
    {value: 'field-1', viewValue: 'Field 1'},
    {value: 'field-2', viewValue: 'Field 2'},
    {value: 'field-3', viewValue: 'Field 3'}
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
