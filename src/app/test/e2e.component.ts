import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EoUiSelectOptionInterface } from '../eoui-select/select.types';

@Component({
  selector: 'e2e-eoui-select',
  template: `
    <eoui-select
      [(ngModel)]="value"
      [eoOptions]="mockData"
      [eoAllowClear]="true"
      [eoShowSearch]="isShowSearch"
      [eoOptionConfig]="{ labelKey: 'label', valueKey: 'value' }"
      [eoIsRequired]="true"
      eoMode="multiple"
      style="width: 200px; margin: 0 auto"
    ></eoui-select>
    <br />
    expected：{{ value.toString() }}
    <br />
    设置数据量：<input type="text" [(ngModel)]="n" />
    <button (click)="generateData()">生成数据</button>
  `,
})
export class E2EEouiSelectComponent {
  mockData: EoUiSelectOptionInterface[] = [];

  value = [];

  n = 10000;

  isShowSearch?: boolean;

  constructor(private sanitizer: DomSanitizer) {
    this.generateData();
  }

  generateData() {
    const list: EoUiSelectOptionInterface[] = [];
    for (let i = 1; i <= this.n; ++i) {
      const text = i % 5 === 0 ? '长长长长长长长长长长长长长长度--' : '';
      list.push({
        label: text + '动态key--' + i,
        value: i,
        customContent: i % 2 === 0,
        templateStr: `<font size="3" class="test" color="red">自定义内容--${i}</font>`,
      });
      this.mockData = list;
    }
  }
}
