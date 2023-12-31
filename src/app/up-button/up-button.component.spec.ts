import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpButtonComponent } from './up-button.component';

describe('UpButtonComponent', () => {
  let component: UpButtonComponent;
  let fixture: ComponentFixture<UpButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpButtonComponent]
    });
    fixture = TestBed.createComponent(UpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
