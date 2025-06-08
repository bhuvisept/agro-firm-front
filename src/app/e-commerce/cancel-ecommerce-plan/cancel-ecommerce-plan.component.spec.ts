import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEcommercePlanComponent } from './cancel-ecommerce-plan.component';

describe('CancelEcommercePlanComponent', () => {
  let component: CancelEcommercePlanComponent;
  let fixture: ComponentFixture<CancelEcommercePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelEcommercePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEcommercePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
