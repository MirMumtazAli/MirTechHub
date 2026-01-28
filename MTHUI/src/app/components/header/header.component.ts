import { Component, ChangeDetectionStrategy, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PageVisibilityService } from '../../services/page-visibility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  pageVisibilityService = inject(PageVisibilityService);
  private elementRef = inject(ElementRef);

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;
  cartItemCount = this.cartService.totalItems;

  isMobileMenuOpen = signal(false);
  isAdminMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  isMobileAdminMenuOpen = signal(false);

  // ⭐ ADD THIS: Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isAdminMenuOpen.set(false);
      this.isUserMenuOpen.set(false);
      this.isMobileMenuOpen.set(false);
      this.isMobileAdminMenuOpen.set(false);
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
    if (this.isMobileMenuOpen()) {
      this.isAdminMenuOpen.set(false);
      this.isUserMenuOpen.set(false);
    } else {
      this.isMobileAdminMenuOpen.set(false);
    }
  }

  toggleAdminMenu() {
    this.isAdminMenuOpen.update(value => !value);
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update(value => !value);
    this.isAdminMenuOpen.set(false);
  }

  toggleMobileAdminMenu() {
    this.isMobileAdminMenuOpen.update(value => !value);
  }
}
