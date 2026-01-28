import { Injectable, signal, effect } from '@angular/core';

// Define a type for the state for better type safety
type PageVisibilityState = {
  note: boolean;
  software: boolean;
  blog: boolean;
  portfolio: boolean;
  reviews: boolean;
  changePassword: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class PageVisibilityService {
  private readonly STORAGE_KEY = 'pageVisibility';

  // Helper to get the initial state from localStorage or defaults
  private getInitialState(): PageVisibilityState {
    try {
      const savedState = localStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        // Merge saved state with defaults to handle cases where new keys are added
        const parsedState = JSON.parse(savedState);
        return { ...this.getDefaultState(), ...parsedState };
      }
    } catch (e) {
      console.error('Failed to parse page visibility state from localStorage', e);
    }
    return this.getDefaultState();
  }

  private getDefaultState(): PageVisibilityState {
    return {
      note: true,
      software: true,
      blog: true,
      portfolio: true,
      reviews: true,
      changePassword: true,
    };
  }

  // Initialize signals from the retrieved state
  readonly noteVisible = signal(this.getInitialState().note);
  readonly softwareVisible = signal(this.getInitialState().software);
  readonly blogVisible = signal(this.getInitialState().blog);
  readonly portfolioVisible = signal(this.getInitialState().portfolio);
  readonly reviewsVisible = signal(this.getInitialState().reviews);
  readonly changePasswordVisible = signal(this.getInitialState().changePassword);

  constructor() {
    // Effect to persist any changes to the signals into localStorage
    effect(() => {
      const currentState: PageVisibilityState = {
        note: this.noteVisible(),
        software: this.softwareVisible(),
        blog: this.blogVisible(),
        portfolio: this.portfolioVisible(),
        reviews: this.reviewsVisible(),
        changePassword: this.changePasswordVisible(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentState));
    });
  }

  toggleNoteVisibility() {
    this.noteVisible.update(v => !v);
  }

  toggleSoftwareVisibility() {
    this.softwareVisible.update(v => !v);
  }

  toggleBlogVisibility() {
    this.blogVisible.update(v => !v);
  }

  togglePortfolioVisibility() {
    this.portfolioVisible.update(v => !v);
  }

  toggleReviewsVisibility() {
    this.reviewsVisible.update(v => !v);
  }

  toggleChangePasswordVisibility() {
    this.changePasswordVisible.update(v => !v);
  }

  isPageVisible(page: 'note' | 'software' | 'blog' | 'portfolio'): boolean {
    switch (page) {
      case 'note': return this.noteVisible();
      case 'software': return this.softwareVisible();
      case 'blog': return this.blogVisible();
      case 'portfolio': return this.portfolioVisible();
      default: return false;
    }
  }
}
