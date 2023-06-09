import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ETransactionType, ITranfer, ITransaction } from '@models/transaction';
import { TransferService } from '@modules/services/transfer.service';
import { UsersService } from '@modules/services/users.service';
import { Observable, Subject, combineLatest, concatMap, fromEvent, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransfersComponent {

  unsubscribe$: Subject<void> = new Subject<void>();

  transferForm = this.fb.group({
    from: this.fb.control(0, [Validators.required]),
    to: this.fb.control(0, [Validators.required]),
    date: this.fb.control('', [Validators.required]),
    amount: this.fb.control(0, [Validators.required]),
  });

  constructor (
    private fb: NonNullableFormBuilder,
    private transferService: TransferService,
    private userService: UsersService,
    private router: Router
  ) {}


  transfer() {
    const dataTransfer = this.transferForm.value as ITranfer;
    const transaction: ITransaction = {
      accountId: dataTransfer.from,
      amount: +dataTransfer.amount.toString().replace(/[^0-9.]/g, ''),
      date: dataTransfer.date,
      merchantId: +dataTransfer.to,
      transactionType: ETransactionType.TRANSFER
    }

    this.userService.userLoggedIn$.pipe(
      map(({user}) => ({ ...transaction, userId: user.id } as ITransaction)),
      concatMap((transaction) => this.transferService.postTransaction(transaction)),
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.router.navigate(['/transactions']));
  }
}
