import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  categories = [
    { id: 1, name: 'Clothing' },
    { id: 2, name: 'Accessories' },
    { id: 3, name: 'Electronics' },
  ];
  selectedCategoryId: number | null = null;

  items: any[] = [];
  cart: any[] = [];

  selectedCampaign: string | null = null;
  seasonalEnabled = false;
  finalTotal : number = 0;

  campaignParams = {
    fixedAmount: 0,
    percent: 0,
    category: 'Clothing',
    categoryPercent: 0,
    points: 0,
    seasonalX: 0,
    seasonalY: 0,
  };

  constructor() { }

  ngOnInit(): void {
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.items = this.loadItemsByCategory(categoryId);
  }

  loadItemsByCategory(categoryId: number): any[] {
    if (categoryId === 1) {
      return [
        { id: 1, name: 'T-Shirt', amount: 350, category: 'Clothing', image_url: 'assets/images/shirt.webp' },
        { id: 2, name: 'Hoodie', amount: 700, category: 'Clothing', image_url: 'assets/images/hoodie.webp' },
      ];
    } else if (categoryId === 2) {
      return [
        { id: 3, name: 'Hat', amount: 250, category: 'Accessories', image_url: 'assets/images/hat.webp' },
        { id: 4, name: 'Bag', amount: 640, category: 'Accessories', image_url: 'assets/images/bag.jpg' },
        { id: 5, name: 'Belt', amount: 230, category: 'Accessories', image_url: 'assets/images/belt.jpg' },
      ];
    }
    else if (categoryId === 3) {
      return [
        { id: 6, name: 'Watch', amount: 850, category: 'Electronics', image_url: 'assets/images/watch.webp' },
      ];
    }
    return [];
  }

  addToCart(item: any) {
    const found = this.cart.find(i => i.id === item.id);
    if (found) {
      found.quantity += 1;
    } else {
      this.cart.push({ ...item, quantity: 1 });
    }
  }

  removeFromCart(itemId: number) {
    this.cart = this.cart.filter(i => i.id !== itemId);
  }

  clearCart() {
    this.cart = [];
    this.finalTotal = 0;
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  }

  selectCampaign(campaign: string) {
    this.selectedCampaign = campaign;
  }

  toggleSeasonal(event: Event) {
    this.seasonalEnabled = (event.target as HTMLInputElement).checked;
  }

  applyDiscounts() {
    let total = this.getTotal();
    const originalTotal = total;

    // Coupon 
    if (this.selectedCampaign === 'fixed') {
      total -= this.campaignParams.fixedAmount;
    } else if (this.selectedCampaign === 'percent') {
      total -= (this.campaignParams.percent / 100) * total;
    }

    // On Top
    if (this.selectedCampaign === 'categoryPercent') {
      const categoryItems = this.cart.filter(i => i.category === this.campaignParams.category);
      const categoryTotal = categoryItems.reduce((sum, i) => sum + i.amount * i.quantity, 0);
      total -= (this.campaignParams.categoryPercent / 100) * categoryTotal;
    } else if (this.selectedCampaign === 'points') {
      const maxDiscount = originalTotal * 0.2;
      const pointDiscount = Math.min(this.campaignParams.points, maxDiscount);
      total -= pointDiscount;
    }

    // Seasonal
    if (this.seasonalEnabled && this.campaignParams.seasonalX > 0) {
      const times = Math.floor(total / this.campaignParams.seasonalX);
      total -= times * this.campaignParams.seasonalY;
    }

    this.finalTotal = Math.max(0, parseFloat(total.toFixed(2)));
  }
}