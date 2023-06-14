import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from '@models/user';
import { UsersService } from '@modules/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {

  userForm = this.fb.group({
    id: this.fb.control(0, [Validators.required]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
  });

  user$ = this.userService.user$;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private router: Router
  ) {
    this.user$.subscribe((user: IUser) => {
      this.patch(user);
    })
  }

  patch(user: IUser) {
    this.userForm.patchValue({ ...user });
  }

  saveUser() {
    const userUpdated = this.userForm.value as IUser;
    this.userService.updateUser(userUpdated);
  }
}
