import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  const getPageTextItems = (): string[] => {
    const compiled = fixture.nativeElement as HTMLElement;

    return Array.from(
      compiled.querySelectorAll(
        '.pagination-pages button, .pagination-ellipsis',
      ),
    ).map((element) => element.textContent?.trim() ?? '');
  };

  it('should show all pages when total pages is small', () => {
    fixture.componentRef.setInput('currentPage', 3);
    fixture.componentRef.setInput('totalPages', 8);
    fixture.detectChanges();

    expect(getPageTextItems()).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ]);
  });

  it('should show trailing ellipsis near the start', () => {
    fixture.componentRef.setInput('currentPage', 1);
    fixture.componentRef.setInput('totalPages', 698);
    fixture.detectChanges();

    expect(getPageTextItems()).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '...',
      '697',
      '698',
    ]);
  });

  it('should show both-side ellipsis in the middle pages', () => {
    fixture.componentRef.setInput('currentPage', 350);
    fixture.componentRef.setInput('totalPages', 698);
    fixture.detectChanges();

    expect(getPageTextItems()).toEqual([
      '1',
      '2',
      '...',
      '349',
      '350',
      '351',
      '...',
      '697',
      '698',
    ]);
  });

  it('should show leading ellipsis near the end', () => {
    fixture.componentRef.setInput('currentPage', 697);
    fixture.componentRef.setInput('totalPages', 698);
    fixture.detectChanges();

    expect(getPageTextItems()).toEqual([
      '1',
      '2',
      '...',
      '691',
      '692',
      '693',
      '694',
      '695',
      '696',
      '697',
      '698',
    ]);
  });

  it('should emit next page when clicking next', () => {
    fixture.componentRef.setInput('currentPage', 2);
    fixture.componentRef.setInput('totalPages', 10);
    fixture.detectChanges();

    const pageChangeSpy = jasmine.createSpy('pageChangeSpy');
    component.pageChange.subscribe(pageChangeSpy);

    const compiled = fixture.nativeElement as HTMLElement;
    const nextButton = Array.from(
      compiled.querySelectorAll('.pagination-button'),
    ).find((button) => button.textContent?.trim() === 'Next') as
      | HTMLButtonElement
      | undefined;

    nextButton?.click();

    expect(pageChangeSpy).toHaveBeenCalledWith(3);
  });
});
