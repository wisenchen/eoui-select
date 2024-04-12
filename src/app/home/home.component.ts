import { Component, OnInit, SimpleChanges } from '@angular/core';
import { EoUiSelectOptionInterface } from '../eoui-select/select.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  title = 'select';

  options: Array<EoUiSelectOptionInterface> = [];

  options1 = [
    { label: 'Jack', value: 'jack' },
    { label: 'Lucy', value: 'lucy' },
  ];
  value:any[] = [];

  activedValue0 = '1';
  activedValue1 = ['1'];
  activedValue2 = ['2'];
  activedValue3 = ['3'];
  activedValue4 = ['4'];
  activedValue5 = ['5'];
  activedValue6 = ['5'];
  activedValue7 = ['7'];

  isDisabled = false;
  dynamicOptions: EoUiSelectOptionInterface[] = [...new Array(10)].map((v, i) => ({
    label: (i + 1) * Math.random() * 1000 + '',
    value: i + '',
  }))

  ngOnInit(): void {
    const children: Array<EoUiSelectOptionInterface> = [];
    for (let i = 1; i < 3000; i++) {
      children.push({ label: i + '', value: i + '' });
    }
    this.options = children;

    // setInterval(() => {
    //   this.options.sort((a,b)=>Math.random()-0.5);
    //   // this.dynamicOptions = [...new Array(10)].map((v, i) => ({
    //   //   label: (i + 1) * Math.random() * 1000 + '',
    //   //   value: i + '',
    //   // }));
    //   this.dynamicOptions.sort((a,b)=>Math.random()-0.5);
    //   this.value = [this.dynamicOptions[2].value]
    // }, 2000);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  handleModelChange(e: any) {
    console.log(e);
  }

  handleOpenChange(e: boolean) {
    console.log(e);
  }
}
