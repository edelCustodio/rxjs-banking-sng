import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from '@models/user';
import { UsersService } from '@modules/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  unsubscribe$: Subject<void> = new Subject<void>();

  userForm = this.fb.group({
    id: this.fb.control(0, [Validators.required]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
  })

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.user$.pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((user: IUser) => {
      this.userForm.patchValue({ ...user });
    });
  }

  saveUser() {
    const userUpdated = this.userForm.value as IUser;
    this.userService.putUser(userUpdated).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => {
      // Additional actions
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
