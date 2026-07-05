import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/product/product-list/product-list.component').then(m => m.ProductListComponent)
    }, {
        path: 'add-products',
        loadComponent: ()=> import('./components/product/add-product/add-product.component').then( m => m.AddProductComponent)
    }, {
        path: 'edit-product/:id',
        loadComponent: () => import('./components/product/add-product/add-product.component').then(m => m.AddProductComponent)
    }
];
