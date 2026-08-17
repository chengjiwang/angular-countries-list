import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the app shell with branding', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const expectedLabel = fixture.componentInstance.isDarkTheme()
      ? 'Light Mode'
      : 'Dark Mode';
    const expectedIconSelector = fixture.componentInstance.isDarkTheme()
      ? 'svg[lucideSun]'
      : 'svg[lucideMoon]';

    expect(compiled.querySelector('.brand')?.textContent).toContain(
      'Where in the world?',
    );
    expect(compiled.querySelector('.theme-toggle')?.textContent).toContain(
      expectedLabel,
    );
    expect(compiled.querySelector(expectedIconSelector)).not.toBeNull();
  });

  it('should switch theme icon and pressed state when toggled', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const themeToggle =
      compiled.querySelector<HTMLButtonElement>('.theme-toggle');
    const initialDarkTheme = fixture.componentInstance.isDarkTheme();

    expect(themeToggle).not.toBeNull();
    expect(themeToggle?.getAttribute('aria-pressed')).toBe(
      String(initialDarkTheme),
    );

    themeToggle?.click();
    fixture.detectChanges();

    expect(themeToggle?.getAttribute('aria-pressed')).toBe(
      String(!initialDarkTheme),
    );
    expect(themeToggle?.textContent).toContain(
      initialDarkTheme ? 'Dark Mode' : 'Light Mode',
    );
    expect(
      compiled.querySelector(
        initialDarkTheme ? 'svg[lucideMoon]' : 'svg[lucideSun]',
      ),
    ).not.toBeNull();
  });
});
