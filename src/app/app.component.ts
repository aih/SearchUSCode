import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SearchUscService } from 'src/app/services/searchusc/searchusc.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

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
export class AppComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  options: USCSection[] = [];
  title = 'searchusc';
  uscSearchControl = new FormControl();
  filteredOptions!: Observable<USCSection[]>;

  constructor(private searchUscService: SearchUscService) {}

  ngOnInit(): void {
    this.subs.add(this.searchUscService.getUSCSections('samplequery').subscribe((data) => {
      console.log(data);
      this.options = data;
     },
     (err: HttpErrorResponse) => {
       console.log(err);
     }));

     this.filteredOptions = this.uscSearchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

   }
   ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  private _filter(value: string): USCSection[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.cite.toLowerCase().includes(filterValue));
  }
}
