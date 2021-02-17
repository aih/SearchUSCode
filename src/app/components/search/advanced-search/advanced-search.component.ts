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
    {value: 'title', viewValue: 'Title'},
    {value: 'heading', viewValue: 'Heading'},
    {value: 'text', viewValue: 'Text'}
  ];

  sortFields = [
    {value: 'asc', viewValue: 'A - Z'},
    {value: 'desc', viewValue: 'Z - A'},
  ];

  constructor() {}


  ngOnInit(): void {
  }

  updateSearchMode(value: string): void {
      //this.searchParams.disable();
      //this.searchParams.enable();
      this.searchParams.patchValue({'mode': value});
  }


}
