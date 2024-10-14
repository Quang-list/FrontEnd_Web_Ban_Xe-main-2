import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../service/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerF: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
  });

  registerMessage: string | null = null; // Thông báo sau khi đăng ký

  constructor(private registerSrv: RegisterService) { }

  onRegister(): void {
    if (this.registerF.invalid) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    this.registerSrv.register(this.registerF.value).subscribe(
      (res) => {
        console.log(res);
        if (res.success) {
          alert('Đăng ký thành công.');
        } else {
          alert('Đăng ký thất bại.');
        }
      },
      (error) => {
        console.error(error);
        alert('Đăng ký thất bại.');
      }
    );
  }
}
