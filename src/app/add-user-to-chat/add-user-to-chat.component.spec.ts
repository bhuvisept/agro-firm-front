import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToChatComponent } from './add-user-to-chat.component';

describe('AddUserToChatComponent', () => {
  let component: AddUserToChatComponent;
  let fixture: ComponentFixture<AddUserToChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserToChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
