import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../service/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginF: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });


  loginMessage: string | null = null; // Biến để lưu thông báo đăng nhập

  constructor(private loginSrv: LoginService) { }

  onLogin(): void {
    if (this.loginF.invalid) { return; }

    this.loginSrv.login(this.loginF.value).subscribe(
      (res: any) => {
        // Quang Chuyển đổi chuỗi văn bản thành JSON
        const parsedRes = JSON.parse(res);
        console.log("Parsed response:", parsedRes);
        console.log("Is Birthday:", parsedRes.isBirthday);

        console.log("Parsed response:", parsedRes);
        if (parsedRes.isBirthday) {
          alert('Đăng nhập thành công! 🎉 Chúc mừng sinh nhật! Bạn được tặng mã giảm giá 20%.');
        } else {
          alert('Đăng nhập thành công!');
        }
        localStorage.setItem('token', res);
        location.assign('http://localhost:4200');
      },

      (error: any) => {
        console.error(error);
        if (error.error && error.error.message) {
          alert(error.error.message);
        } else {
          alert("Wrong Email or password.");
        }
        console.log("Login failed");
        localStorage.removeItem('token');
      }
    );
  }

}
