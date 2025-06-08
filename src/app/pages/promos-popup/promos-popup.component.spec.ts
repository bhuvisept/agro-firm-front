import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosPopupComponent } from './promos-popup.component';

describe('PromosPopupComponent', () => {
  let component: PromosPopupComponent;
  let fixture: ComponentFixture<PromosPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromosPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
