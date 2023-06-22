import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ETransactionType, ITranfer, ITransaction } from '@models/transaction';
import { TransferService } from '@modules/services/transfer.service';
import { UsersService } from '@modules/services/users.service';
import { Observable, Subject, combineLatest, concatMap, filter, fromEvent, map, merge, startWith, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransfersComponent implements OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();

  protected buttonTransferSubject = new Subject<void>();
  buttonTransfer$ = this.buttonTransferSubject.asObservable();

  transferForm = this.fb.group({
    from: this.fb.control(0, [Validators.required]),
    to: this.fb.control(0, [Validators.required]),
    date: this.fb.control('', [Validators.required]),
    amount: this.fb.control(0, [Validators.required]),
  });

  form$ = this.buttonTransfer$.pipe(
    switchMap(() => this.transferForm.valueChanges.pipe(startWith(this.transferForm.value))),
    filter((a) => this.transferForm.valid),
    map(form => ({
      accountId: form.from,
      amount: +form.amount!.toString().replace(/[^0-9.]/g, ''),
      date: form.date,
      merchantId: +form.to!,
      transactionType: ETransactionType.TRANSFER
    } as ITransaction))
  )

  transaction$ = combineLatest([
    this.userService.userLoggedIn$,
    this.form$
  ]).pipe(
    map(([{ user }, transaction]) => ({ ...transaction, userId: user.id } as ITransaction))
  )


  constructor (
    private fb: NonNullableFormBuilder,
    private transferService: TransferService,
    private userService: UsersService,
    private router: Router,
    public dialogRef: MatDialogRef<TransfersComponent, ITransaction>,
    @Inject(MAT_DIALOG_DATA) public data: { modal: boolean },
  ) {

    this.transaction$.pipe(
      switchMap((transaction) => this.transferService.postTransaction(transaction)),
      takeUntil(this.unsubscribe$),
    ).subscribe(() => this.router.navigate(['/transactions']));
  }


  transfer() {
    if (!this.transferForm.valid) return;

    const dataTransfer = this.transferForm.value as ITranfer;
    const transaction: ITransaction = {
      accountId: dataTransfer.from,
      amount: +dataTransfer.amount.toString().replace(/[^0-9.]/g, ''),
      date: dataTransfer.date,
      merchantId: +dataTransfer.to,
      transactionType: ETransactionType.TRANSFER
    }

    if (this.data.modal) {
      this.dialogRef.close(transaction);
    } else {
      this.userService.userLoggedIn$.pipe(
        map(({user}) => ({ ...transaction, userId: user.id } as ITransaction)),
        switchMap((transaction) => this.transferService.postTransaction(transaction)),
        takeUntil(this.unsubscribe$)
      ).subscribe(() => this.router.navigate(['/transactions']));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
