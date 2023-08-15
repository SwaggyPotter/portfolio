import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySiteComponent } from './my-site.component';

describe('MySiteComponent', () => {
  let component: MySiteComponent;
  let fixture: ComponentFixture<MySiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MySiteComponent]
    });
    fixture = TestBed.createComponent(MySiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
