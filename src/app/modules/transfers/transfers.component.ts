import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ETransactionType, ITranfer, ITransaction } from '@models/transaction';
import { TransferService } from '@modules/services/transfer.service';
import { UsersService } from '@modules/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {

  transferForm = this.fb.group({
    from: this.fb.control(0, [Validators.required]),
    to: this.fb.control(0, [Validators.required]),
    date: this.fb.control('', [Validators.required]),
    amount: this.fb.control(0, [Validators.required]),
  });

  userId: number = 0;
  unsubscribe$: Subject<void> = new Subject<void>();

  constructor (
    private fb: NonNullableFormBuilder,
    private transferService: TransferService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.userLoggedIn$.subscribe(({ user }) => this.userId = user.id)
  }

  transfer() {
    const dataTransfer = this.transferForm.value as ITranfer;
    const transaction: ITransaction = {
      accountId: dataTransfer.from,
      amount: +dataTransfer.amount.toString().replace(/[^0-9.]/g, ''),
      date: dataTransfer.date,
      merchantId: +dataTransfer.to,
      transactionType: ETransactionType.TRANSFER,
      userId: this.userId
    }

    this.transferService.postTransaction(transaction).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(() => {
      this.router.navigate(['/transactions']);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
