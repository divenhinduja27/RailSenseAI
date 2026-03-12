import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayMonitorComponent } from './delay-monitor.component';

describe('DelayMonitorComponent', () => {
  let component: DelayMonitorComponent;
  let fixture: ComponentFixture<DelayMonitorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelayMonitorComponent]
    });
    fixture = TestBed.createComponent(DelayMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
