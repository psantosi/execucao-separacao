import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExecucaoOrdemSeparacaoPage } from './execucao-ordem-separacao.page';

describe('ExecucaoOrdemSeparacaoPage', () => {
  let component: ExecucaoOrdemSeparacaoPage;
  let fixture: ComponentFixture<ExecucaoOrdemSeparacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecucaoOrdemSeparacaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExecucaoOrdemSeparacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
