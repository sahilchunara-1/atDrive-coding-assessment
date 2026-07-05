import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { WeatherService } from '../../../core/services/weather.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  weather: any = null;
  weatherLoading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadWeather();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error =
          err.error?.message || 'Failed to load products';
        this.loading = false;
      },
    });
  }

  loadWeather() {
    this.weatherLoading = true;

    if (!navigator.geolocation) {
      this.weatherLoading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        this.weatherService
          .getWeather(lat, lon)
          .subscribe({
            next: (res: any) => {
              this.weather = res.data;
              this.weatherLoading = false;
            },
            error: () => {
              this.weatherLoading = false;
            },
          });
      },
      () => {
        this.weatherLoading = false;
      }
    );
  }

  onUpdate(productId: string | undefined) {
    if (!productId) {
      alert('Product ID is missing');
      return;
    }
    this.router.navigate(['edit-product', productId]);
  }

  onDelete(productId: string | undefined) {
    if (!productId) {
      return;
    }

    const confirmed = confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) {
      return;
    }

    this.productService.deleteProduct(productId).subscribe({
      next: (res: any) => {
        alert(res.message);

        this.products = this.products.filter(
          (product) => product._id !== productId
        );
      },
      error: (err) => {
        alert(
          err.error?.message ||
          'Failed to delete product'
        );
      },
    });
  }
}
