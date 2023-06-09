import { Component } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import { ITransaction } from '@models/transaction';
import { Observable, combineLatest, debounceTime, map, startWith } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  searchForm = this.fb.group({
    search: this.fb.control('')
  });

  get searchControl() {
    return this.searchForm.get('search') as FormControl;
  }

  constructor(
    private transactionsService: TransactionsService,
    private fb: FormBuilder
  ) {}

  filteredTransactions$: Observable<ITransaction[]> = combineLatest([
    this.transactionsService.transactionsWithAllData$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(1000))
  ]).pipe(
    map(([transactions, text]) => transactions.filter(t => t.merchantName?.toLowerCase().includes(text.toLowerCase())))
  );

}
