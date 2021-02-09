import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchUscService } from '../../services/searchusc/searchusc.service';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, first, map, startWith, switchMap } from 'rxjs/operators';
import { USCSection } from '../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { removeEmpty } from '../../utils/utils';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @ViewChild('search') search: any;
  searchParams = new FormGroup({
    q: new FormControl(),
    sort: new FormControl(),
    searchBy: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
  });


  data: any;
  options: USCSection[] = [];
  title = 'searchusc';
  filteredOptions!: Observable<USCSection[]>;

  private subs = new Subscription();

  constructor(
    private searchUscService: SearchUscService,
    private cdr: ChangeDetectorRef,
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

    this.filteredOptions = this.searchParams.controls.q.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this.route.queryParams
      .pipe(
        first(),
        filter(res => {
          this.searchParams.patchValue(res);
          return res.q;
        }),
        switchMap(res => this.searchUscService.getData(this.router.url))
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

  getData(params?: any): void {
    if (!params) {
      params = removeEmpty(this.searchParams.value);
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    }).then(() => {
      this.searchUscService.getData(this.router.url).subscribe(res => {
        this.data = res;
      });
    });


  }


  pageChanged(event: any): void {
    const params = removeEmpty(this.searchParams.value);
    params._from = event.pageSize  * (event.pageIndex);
    this.getData(params);
  }
}
