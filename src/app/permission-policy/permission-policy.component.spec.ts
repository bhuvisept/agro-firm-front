import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionPolicyComponent } from './permission-policy.component';

describe('PermissionPolicyComponent', () => {
  let component: PermissionPolicyComponent;
  let fixture: ComponentFixture<PermissionPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
