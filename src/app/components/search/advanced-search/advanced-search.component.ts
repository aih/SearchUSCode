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
      const options = ['sort', 'searchBy', 'from', 'to'];
      console.log(value);
      if(value == 'querystring') {
        for(const item of options) {
          this.searchParams.controls[item].disable();
        }
      } else {
        for(const item of options) {
          this.searchParams.controls[item].enable();
        }
      }
      this.searchParams.patchValue({'mode': value});
  }


}
