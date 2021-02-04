import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { SearchUscService } from '../../services/searchusc/searchusc.service';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, first, map, startWith, switchMap } from 'rxjs/operators';
import { USCSection } from '../../app.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('search') search: any;
  data: any;
  private subs = new Subscription();
  options: USCSection[] = [];
  title = 'searchusc';
  uscSearchControl = new FormControl();
  filteredOptions!: Observable<USCSection[]>;

  constructor(
    private searchUscService: SearchUscService,
    private router: Router,
    private route: ActivatedRoute) {
  }

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

    this.route.queryParams
      .pipe(
        first(),
        filter(res => {
          this.uscSearchControl.patchValue(res.q);
          return res.q;
        }),
        switchMap(res => this.searchUscService.getMock(res.q))
      )
      .subscribe(res => {
        this.data = res;
      });

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

  getData(value: any): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: value
      },
      queryParamsHandling: 'merge',
    });


    /*TODO Request to backend*/

    this.searchUscService.getMock(value).subscribe(res => {
      this.data = res;
    });
  }
}
