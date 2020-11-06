import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserFeedPage } from './user-feed.page';

describe('UserFeedPage', () => {
  let component: UserFeedPage;
  let fixture: ComponentFixture<UserFeedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFeedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
