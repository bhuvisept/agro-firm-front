import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPlanDialogComponent } from './cancel-plan-dialog.component';

describe('CancelPlanDialogComponent', () => {
  let component: CancelPlanDialogComponent;
  let fixture: ComponentFixture<CancelPlanDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelPlanDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
