import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/Cart';
import { CartService } from '../../service/cart.service';
import { Check_Out } from '../../models/Check_Out';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CheckOutService } from '../../service/checkout.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  carts: Cart[] = [];
  checkoutFormCreate: FormGroup;

  constructor(
    private CartSV: CartService,
    private CheckoutSV: CheckOutService,
    private router: Router,
    private AuthSV: AuthService // Inject AuthService
  ) {
    // Khởi tạo FormGroup với các validators
    this.checkoutFormCreate = new FormGroup({
      ShipName: new FormControl('', Validators.required),
      ShipAddress: new FormControl('', Validators.required),
      ShipEmail: new FormControl('', [Validators.required, Validators.email]),
      ShipPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]) // Validator cho số điện thoại
    });
  }

  ngOnInit(): void {
    this.CartSV.getCart().subscribe((res: any) => {
      if (res && res.data && Array.isArray(res.data)) {
        this.carts = res.data;
        console.log(this.carts);
      } else {
        console.error("Invalid data format:", res);
      }
    });

    // Kiểm tra xem người dùng có đăng nhập không
    if (this.AuthSV.isLoggedIn()) {
      // Nếu có tài khoản, điền thông tin vào form
      const userName = this.AuthSV.getUserNameFromToken();
      console.log('Username from token:', userName);

      // Gọi hàm lấy thông tin người dùng từ API
      this.AuthSV.getUserInfo().subscribe(userInfo => {
        if (userInfo) {
          // Điền thông tin vào form
          this.checkoutFormCreate.patchValue({
            ShipName: userInfo.name || '',  // Đảm bảo giá trị không phải null
            ShipAddress: userInfo.address || '',
            ShipEmail: userInfo.email || '',
            ShipPhone: userInfo.phone || '',
          });
        } else {
          console.error("No user info found");
        }
      });
    } else {
      console.log("User is not logged in");
    }
  }

  getImageUrl(data: Cart): string {
    const HostUrl = "https://localhost:7066/api";
    return data && data.productId ? `${HostUrl}/Products/images/product/${data.productId}` : "Id not found";
  }

  calculateTotal(): number {
    return this.carts.reduce((total, cart) => total + cart.totalPrice, 0);
  }

  calculateSubtotal() {
    return this.carts.reduce((total, cart) => total + (cart.totalPrice || 0), 0);
  }

  onCreate(): void {
    if (this.checkoutFormCreate.invalid) {
      console.error("Form is invalid");
      alert("Vui lòng kiểm tra thông tin nhập vào");
      return;
    }

    // Trích xuất chỉ ID của sản phẩm từ mảng carts
    const productIds = this.carts.map(item => item.productId);
    const orderData = {
      ...this.checkoutFormCreate.value,
      cart: productIds // Chỉ truyền mảng ID sản phẩm
    };

    console.log('Order Data:', orderData);

    this.CheckoutSV.create(orderData).subscribe({
      next: (data) => {
        console.log('Response Data:', data);
        const userConfirmed = window.confirm('Đơn hàng đã được đặt thành công. Bạn có muốn chuyển đến trang sản phẩm?');
        if (userConfirmed) {
          // Chuyển hướng đến trang sản phẩm
          this.router.navigate(['/product']);

          // Gọi hàm xóa giỏ hàng sau khi đặt hàng thành công
          this.CartSV.deleteAllProductsByUser(productIds).subscribe({
            next: () => {
              console.log('Giỏ hàng đã được xóa thành công');
            },
            error: (err) => {
              console.error("Lỗi khi xóa giỏ hàng:", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Lỗi khi tạo đơn hàng:", err);
        alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
      }
    });
  }
}
