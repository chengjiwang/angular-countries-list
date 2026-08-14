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
    expect(compiled.querySelector('.brand')?.textContent).toContain(
      'Where in the world?',
    );
    expect(compiled.querySelector('.theme-toggle')?.textContent).toContain(
      'Dark Mode',
    );
  });
});
