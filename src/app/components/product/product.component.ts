import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../service/products.service';
import { CartService } from '../../service/cart.service';
import { Product_Price } from '../../models/Product_Price';
import { ProductResponse } from '../../models/Product_Price';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  producPrice: Product_Price[] = [];
  isDataAvailable: boolean = true;
  selectedBrands: string[] = [];
  filteredProducts: Product_Price[] = [];
  currentMinPrice: number = 0;
  currentMaxPrice: number = 50000000;
  selectedBrand: string = "";
  itemsPerPage = 9;
  currentPage = 1;

  constructor(private productService: ProductsService, private cartSv: CartService, private router: Router) { }

  ngOnInit(): void {
    this.generateSampleData();
    this.getAllPrices(this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
    this.selectAllBrands();
  }

  selectAllBrands() {
    const allBrandsCheckbox = document.getElementById('color-all') as HTMLInputElement;
    if (allBrandsCheckbox) {
      allBrandsCheckbox.checked = true;
    }
  }

  formatPriceToVND(price: number): string {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }

  getImageUrl(data: Product_Price): string {
    const HostUrl = "https://localhost:5001/api";
    return data && data.id ? `${HostUrl}/Products/images/product/${data.id}` : '';
  }

  onAddToCart(products: Product_Price[]) {
    alert('Bạn có thể thêm sản phẩm vào giỏ hàng tạm thời.');
    let tempCart: any[] = JSON.parse(localStorage.getItem('tempCart') || '[]');

    products.forEach(product => {
      const productId = product.id;
      const productName = product.productName;
      const priceProduct = product.priceHasDecreased || product.price;
      const quantity = 1;

      const existingProduct = tempCart.find(item => item.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity; // Nếu có, tăng số lượng
      } else {
        tempCart.push({ productId, productName, priceProduct, quantity }); // Nếu chưa có, thêm sản phẩm mới
      }
    });

    localStorage.setItem('tempCart', JSON.stringify(tempCart));
    alert('Sản phẩm đã được thêm vào giỏ hàng tạm thời.');
  }

  onViewProduct(product: Product_Price) {
    this.router.navigate(['/product-detail', product.id]);
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.producPrice.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.producPrice.length / this.itemsPerPage);
  }

  changePage(page: number, event: Event): void {
    event.preventDefault();
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  onCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const checkboxes = (event.currentTarget as HTMLFormElement).querySelectorAll('input[type="checkbox"]');

    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    switch (target.id) {
      case 'price-1':
        this.currentMinPrice = 0;
        this.currentMaxPrice = 5000000;
        break;
      case 'price-2':
        this.currentMinPrice = 5000000;
        this.currentMaxPrice = 10000000;
        break;
      case 'price-3':
        this.currentMinPrice = 10000000;
        this.currentMaxPrice = 20000000;
        break;
      case 'price-4':
        this.currentMinPrice = 20000000;
        this.currentMaxPrice = 30000000;
        break;
      case 'price-5':
        this.currentMinPrice = 30000000;
        this.currentMaxPrice = 40000000;
        break;
      case 'price-all':
        this.currentMinPrice = 0;
        this.currentMaxPrice = 50000000;
        break;
      default:
        return;
    }

    this.getAllPrices(this.currentMinPrice, this.currentMaxPrice, this.selectedBrand);
  }

  getAllPrices(minPrice: number, maxPrice: number, brandName: string) {
    const apiUrl = `https://localhost:5001/api/Products/GetProductsWithinPriceRangeAndBrand?minPrice=${minPrice}&maxPrice=${maxPrice}&brandsName=${brandName}`;
    console.log('Fetching prices between:', minPrice, maxPrice, 'for brand:', brandName);

    this.productService.getListPrice(minPrice, maxPrice, brandName).subscribe(
      (response: ProductResponse) => {
        console.log('Phản hồi nhận được:', response);
        this.producPrice = response.data;
        this.isDataAvailable = true;

        // Lọc sản phẩm theo thương hiệu
        this.filterProducts();

        this.producPrice.forEach(product => {
          console.log(`Tên sản phẩm: ${product.productName}, Giá: ${product.price}, Giá đã giảm: ${product.priceHasDecreased}`);
        });

        if (this.producPrice.length === 0) {
          console.log('Không có sản phẩm');
        }
      },
      (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
        this.isDataAvailable = false;
      }
    );
  }

  onCheckboxChangeBrand(event: Event) {
    const target = event.target as HTMLInputElement;
    const checkboxes = (event.currentTarget as HTMLFormElement).querySelectorAll('input[type="checkbox"]');

    if (target.checked) {
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox as HTMLInputElement;
        if (inputCheckbox !== target) {
          inputCheckbox.checked = false;
        }
      });
    }

    // Cập nhật selectedBrand dựa trên checkbox được chọn
    switch (target.id) {
      case 'color-1':
        this.selectedBrand = "Trek";
        break;
      case 'color-2':
        this.selectedBrand = "Giant";
        break;
      case 'color-3':
        this.selectedBrand = "Specialized";
        break;
      case 'color-4':
        this.selectedBrand = "Cannondale";
        break;
      case 'color-5':
        this.selectedBrand = "Scott";
        break;
      case 'color-6':
        this.selectedBrand = "Bianchi";
        break;
      case 'color-7':
        this.selectedBrand = "Merida";
        break;
      case 'color-8':
        this.selectedBrand = "Salsa Cycles";
        break;
      case 'color-all':
        this.selectedBrand = "all"; // Đặt selectedBrand là 'all' khi chọn 'All'
        break;
      default:
        return;
    }

    // Lọc sản phẩm sau khi chọn thương hiệu
    this.filterProducts();
  }
  filterByBrand(brand: string) {
    if (brand === 'all') {
        this.filteredProducts = this.producPrice; // Giả sử 'products' chứa tất cả sản phẩm
    } else {
        this.filteredProducts = this.producPrice.filter(product => product.brandNamer === brand);
    }
}


  filterProducts() {
    this.filteredProducts = this.producPrice.filter(product =>
      this.selectedBrands.length === 0 || this.selectedBrands.includes(product.brandNamer)
    );
  }


  generateSampleData() {
    this.producPrice = [
      {
        id: 1,
        productName: 'Xe đạp thể thao Trek 1.1',
        price: 15000000,
        priceHasDecreased: 13000000,
        image: 'https://product.hstatic.net/1000092436/product/xe-dap-dia-hinh-trek-marlin-5-blk_b4f2946df45c4040a83c04b9cd3fd952_master.jpg',
        brandNamer: 'Trek',
      },
      {
        id: 2,
        productName: 'Xe đạp địa hình Giant ATX 2',
        price: 12000000,
        priceHasDecreased: 10000000,
        image: 'url_to_image_2.jpg',
        brandNamer: 'Giant',
      },
      {
        id: 3,
        productName: 'Xe đạp đường trường Specialized Allez',
        price: 20000000,
        priceHasDecreased: 18000000,
        image: 'url_to_image_3.jpg',
        brandNamer: 'Specialized',
      },
      {
        id: 4,
        productName: 'Xe đạp địa hình Cannondale Trail 8',
        price: 17000000,
        priceHasDecreased: 12000,
        image: 'url_to_image_4.jpg',
        brandNamer: 'Cannondale',
      },
      {
        id: 5,
        productName: 'Xe đạp đường trường Scott Speedster',
        price: 25000000,
        priceHasDecreased: 12000,
        image: 'url_to_image_5.jpg',
        brandNamer: 'Scott',
      },
    ];
  }
}
