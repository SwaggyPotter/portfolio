import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeMainComponent } from './me-main.component';

describe('MeMainComponent', () => {
  let component: MeMainComponent;
  let fixture: ComponentFixture<MeMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeMainComponent]
    });
    fixture = TestBed.createComponent(MeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
