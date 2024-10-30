import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-create-type',
  templateUrl: './create-type.component.html',
  styleUrls: ['./create-type.component.scss']
})
export class CreateTypeComponent implements OnInit {
  typeForm: FormGroup;
  registerMessage: string | null = null;
  private apiUrl = 'https://localhost:5001/api/type/create';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      productType: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onCreateType(): void {
    if (this.typeForm.valid) {
      const typeData = this.typeForm.value;
      this.http.post(this.apiUrl, typeData).subscribe(
        response => {
          this.registerMessage = 'Tạo Mới Type thành công!';
          this.typeForm.reset();
        },
        error => {
          this.registerMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
        }
      );
    }
  }
  navigateToAdminPanel(): void {
    this.router.navigate(['admin-panel']); // Điều hướng đến admin-panel
  }
  onLogout() {
    localStorage.removeItem('token'); // Xóa token khỏi local storage
    this.router.navigate(['/admin-login']); // Chuyển hướng về trang đăng nhập
  }
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
