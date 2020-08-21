import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpopupComponent } from './chatpopup.component';

describe('ChatpopupComponent', () => {
  let component: ChatpopupComponent;
  let fixture: ComponentFixture<ChatpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
