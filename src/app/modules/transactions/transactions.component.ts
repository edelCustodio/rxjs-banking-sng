import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransactionsService } from '../services/transactions.service';
import { ITransaction } from '@models/transaction';
import { Subject, debounceTime, forkJoin, takeUntil } from 'rxjs';
import { UsersService } from '@modules/services/users.service';
import { MerchantsService } from '@modules/services/merchants.service';
import { AccountsService } from '@modules/services/accounts.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  transactions!: ITransaction[];
  filteredTransactions!: ITransaction[];
  unsubscribe$: Subject<void> = new Subject<void>();
  searchForm = this.fb.group({
    search: this.fb.control('', [Validators.required])
  });

  get searchControl() {
    return this.searchForm.get('search') as FormControl;
  }

  constructor(
    private transactionsService: TransactionsService,
    private usersService: UsersService,
    private merchantsService: MerchantsService,
    private accountsService: AccountsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const merchants$ = this.merchantsService.getMerchantsWithType();
    const transactions$ = this.transactionsService.getTransactions();
    const account$ = this.accountsService.getAccountById();
    const userLoggedIn$ = this.usersService.userLoggedIn$;

    forkJoin([
      transactions$,
      merchants$,
      account$,
      userLoggedIn$
    ]).pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(
      ([transactions, merchants, account, userloggedIn]) => {
        this.transactions = transactions.map(
          (transaction: ITransaction) => ({
            ...transaction,
            userName: userloggedIn.user.firstName,
            merchantName: merchants.find(m => m.id === transaction.merchantId)?.name,
            merchantType: merchants.find(m => m.id === transaction.merchantId)?.merchantName,
            accountNumber: account.accountNumber
          } as ITransaction)
        ).sort((a, b) => (Date.parse((new Date(b.date).toString())) - Date.parse((new Date(a.date)).toString())));
        this.filteredTransactions = [...this.transactions];
        console.log(this.transactions);
      }
    );

    this.searchControl.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      debounceTime(1000),
    ).subscribe((text : string) => {
      this.search(text);
    })
  }

  search(text: string) {
    console.log(text);
    this.filteredTransactions = this.transactions.filter(t => t.merchantName?.toLowerCase().includes(text.toLowerCase()));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
