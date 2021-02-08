import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  @Input() searchParams!: FormGroup;

  searchFields = [
    {value: 'field-1', viewValue: 'Field 1'},
    {value: 'field-2', viewValue: 'Field 2'},
    {value: 'field-3', viewValue: 'Field 3'}
  ];

  sortFields = [
    {value: 'az', viewValue: 'A - Z'},
    {value: 'za', viewValue: 'Z - A'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
