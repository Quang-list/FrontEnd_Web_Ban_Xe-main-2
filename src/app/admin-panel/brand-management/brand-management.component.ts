import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-management',
  templateUrl: './brand-management.component.html',
  styleUrls: ['./brand-management.component.scss']
})
export class BrandManagementComponent implements OnInit {
  brandForm: FormGroup;
  apiBase = 'https://localhost:5001/api/Brand'; // Địa chỉ API
  registerMessage: string | null = null; // Thông báo tạo thương hiệu thành công

  constructor(private http: HttpClient, private router: Router) {
    this.brandForm = new FormGroup({
      brandName: new FormControl('', Validators.required), // Trường tên thương hiệu
      origin: new FormControl('', Validators.required), // Trường nguồn gốc thương hiệu
    });
  }

  ngOnInit(): void { }

  // Hàm tạo thương hiệu
  onCreateBrand(): void {
    if (this.brandForm.invalid) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    this.http.post(`${this.apiBase}/Create`, this.brandForm.value, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe(
      (response: any) => {
        if (response.success) {
          this.registerMessage = 'Tạo thương hiệu thành công.';
          this.brandForm.reset(); // Reset form sau khi thành công
        } else {
          alert('Tạo thương hiệu thất bại.');
        }
      },
      (error) => {
        console.error('Error creating brand', error);
        alert('Tạo thương hiệu thất bại.');
      }
    );
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
