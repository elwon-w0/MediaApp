import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResponseResetPage } from './response-reset.page';

describe('ResponseResetPage', () => {
  let component: ResponseResetPage;
  let fixture: ComponentFixture<ResponseResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseResetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResponseResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
