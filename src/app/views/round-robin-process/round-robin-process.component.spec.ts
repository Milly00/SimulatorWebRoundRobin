import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundRobinProcessComponent } from './round-robin-process.component';

describe('RoundRobinProcessComponent', () => {
  let component: RoundRobinProcessComponent;
  let fixture: ComponentFixture<RoundRobinProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundRobinProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundRobinProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
