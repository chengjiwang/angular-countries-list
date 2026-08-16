import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly themeService = inject(ThemeService);

  readonly isDarkTheme = computed(() => this.themeService.theme() === 'dark');

  readonly themeButtonLabel = computed(() =>
    this.isDarkTheme() ? 'Light Mode' : 'Dark Mode',
  );

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
