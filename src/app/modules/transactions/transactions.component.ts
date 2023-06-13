import { Component } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import { ITransaction } from '@models/transaction';
import { Observable, combineLatest, concatMap, debounceTime, map, startWith, switchMap } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TransfersComponent } from '@modules/transfers/transfers.component';
import { UsersService } from '@modules/services/users.service';

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
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  filteredTransactions$: Observable<ITransaction[]> = combineLatest([
    this.transactionsService.transactionsWithCRUD$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(1000))
  ]).pipe(
    map(([transactions, text]) => transactions.filter(t => t.merchantName?.toLowerCase().includes(text.toLowerCase())))
  );

  openDialog(): void {
    const dialogRef = this.dialog.open(TransfersComponent, {
      data: { modal: true },
    });

    dialogRef.afterClosed().subscribe((transaction: ITransaction) => {
      console.log('The dialog was closed', transaction);
      this.transactionsService.addTransaction(transaction);
    });
  }

}
