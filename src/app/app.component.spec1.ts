/*
 * @Name: file content
 * @Copyright: 广州银云信息科技有限公司
 * @Author:
 * @Date: 2022-02-23 14:28:54
 * @LastEditors: wisen
 * @LastEditTime: 2022-02-23 14:37:02
 */
/*
 * @Name: file content
 * @Copyright: 广州银云信息科技有限公司
 * @Author:
 * @Date: 2022-02-22 17:31:43
 * @LastEditors: wisen
 * @LastEditTime: 2022-02-23 14:12:59
 */
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { EouiSelectComponent } from './eoui-select/select.component';
import { EouiSelectModule } from './eoui-select/select.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    EouiSelectComponent.parameters = [ElementRef];
    await TestBed.configureTestingModule({
      imports: [EouiSelectModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
