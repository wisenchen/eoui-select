import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OptionContainerComponent } from './option-container.component';
import { OptionItemComponent } from './option-item.component';
import { EoUiOptionComponent } from './option.component';
import { EoUiSelectTopControlComponent } from './select-top-control.component';
import { EouiSelectComponent } from './select.component';
import { EoUiSelectOptionInterface } from './select.types';

describe('EouiSelectComponent', () => {
  let component: EouiSelectComponent;
  let fixture: ComponentFixture<EouiSelectComponent>;
  let compiled: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        EouiSelectComponent,
        OptionItemComponent,
        OptionContainerComponent,
        EoUiOptionComponent,
        EoUiSelectTopControlComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EouiSelectComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
    resetState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('1.测试传入eoOptions后数据是否正常被转换', () => {
    fixture.detectChanges();
    const options: EoUiSelectOptionInterface[] = [
      { name: 'a', val: '1' },
      { name: 'b', val: '2' },
      { name: 'c', val: '3' },
    ];
    component.eoOptions = options;
    component.eoOptionConfig = {
      labelKey: 'name',
      valueKey: 'val',
    };
    // 执行初始化钩子
    component.ngOnInit();
    expect(component.listOfOption.length).toBe(3);

    // 后续动态修改
    component.eoOptionConfig = {
      labelKey: 'label',
      valueKey: 'value',
    };
    component.eoOptions = generateMockData(10);
    // 模拟触发onChanges
    component.ngOnChanges({
      eoOptions: new SimpleChange(undefined, component.eoOptions, false),
    });
    expect(component.listOfOption.length).toBe(10);

  });

  it('2.测试下拉框能否正常出现隐藏', () => {
    const selectTopControlEl = compiled.querySelector('eoui-select-top-control');
    selectTopControlEl.click();
    fixture.detectChanges();
    // 点击第一次时下拉框出现
    expect(document.querySelector('eoui-option-container')).not.toBeNull();
    selectTopControlEl.click();
    fixture.detectChanges();
    // 点击第二次时下拉框隐藏
    expect(document.querySelector('eoui-option-container')).toBeNull();

    selectTopControlEl.click();
    fixture.detectChanges();
    const mousedownEvent = new Event('mousedown') as any;
    mousedownEvent.button = 0;
    document.dispatchEvent(mousedownEvent);
    fixture.detectChanges();
    // 点击其他地方时是否隐藏
    expect(component.open).toBe(false);
    selectTopControlEl.click();
    fixture.detectChanges();
    document.dispatchEvent(new Event('mouseup'));
    const mouseupEvent = new Event('mouseup') as any;
    mouseupEvent.button = 0;
    document.dispatchEvent(mouseupEvent);
    fixture.detectChanges();
    expect(component.open).toBe(false);
  });

  it('3.测试选择下拉项后是否能正常回填数据，以及将数据传出', () => {
    component.eoOptions = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' },
      { label: '梨子', value: 'pear' },
    ];
    component.open = true;
    component.ngOnInit();
    fixture.detectChanges();
    // 点击香蕉
    (document.querySelectorAll('eoui-option-item')[1] as HTMLElement)?.click();
    fixture.detectChanges();
    // 验证选择项是否为 banana
    expect(component.listOfValue).toEqual(['banana']);
  });

  it('4.测试默认值能否回填，以及点击清除按钮能否清空数据', () => {
    component.eoOptions = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' },
      { label: '梨子', value: 'pear' },
    ];
    component.eoAllowClear = true;
    component.ngOnInit();
    component.writeValue('pear');
    fixture.detectChanges();
    // 默认值能否回填成功
    expect(component.listOfItem).toEqual([{ label: '梨子', value: 'pear' }]);
    const closeBtn = compiled.querySelector('.eoui-select-close');
    expect(closeBtn).not.toBeNull();
    // 点击清除按钮
    closeBtn.click();
    fixture.detectChanges();
    // 验证选择项是否被清空
    expect(component.listOfValue).toEqual([]);
  });

  it('5.测试搜索功能和全选功能是否正常', () => {
    component.eoOptions = [
      { label: 'aa', value: '1' },
      { label: '1Aa1', value: '2' },
      { label: 'aA', value: '3' },
      { label: 'abab', value: '4' },
    ];
    component.eoShowSearch = true;
    component.eoShowCheckBox = true;
    component.eoMode = 'multiple';
    component.open = true;
    // 初始化所有配置项， 此时下拉框应为 多选，展示复选框，可搜索
    component.ngOnInit();
    fixture.detectChanges();
    const searchInputEl = document.querySelector('.eoui-select-search-input') as HTMLInputElement;
    searchInputEl.value = 'aa';
    fixture.detectChanges();
    searchInputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    // 搜索结果应为3条数据
    expect(document.querySelectorAll('.eoui-option-item').length).toBe(3);
    // 测试在搜索状态下的全选功能
    const selectAllBtn = document.querySelector('.eoui-select-search .eoui-select-checkbox') as HTMLInputElement;
    selectAllBtn.click();
    fixture.detectChanges();
    expect(component.listOfValue.length).toBe(3);
    // 取消全选
    selectAllBtn.click();
    fixture.detectChanges();
    expect(component.listOfValue.length).toBe(0);
  });

  it('6.测试自定义模版内容是否有效', () => {
    component.eoOptions = [
      { label: '苹果', value: 'apple' },
      {
        label: '香蕉',
        value: 'banana',
        customContent: true,
        templateStr: '<div class="test-custom">香蕉</div>',
      },
      { label: '梨子', value: 'pear' },
    ];
    component.open = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(document.querySelector('.eoui-option-container .test-custom')).not.toBeNull();
  });

  // ---------- 以下为对angular.js兼容性的测试 start ----------

  it('7.验证angular.js中数据传入与传出是否正常', async () => {

    component.eoOptions = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' },
      { label: '梨子', value: 'pear' },
    ];
    // 设置默认值
    component.eoValue = 'banana';
    // 绑定输出对象
    const outputObj = { valueKey: '' };
    component.eoOutput = outputObj;
    // 需要更新到输出对象上的value key
    component.eoModelKey = 'valueKey';
    component.ngOnInit();
    fixture.detectChanges();
    // 验证默认是否选中了'banana'
    expect(component.listOfValue).toEqual(['banana']);
    // 打开下拉框
    component.setOpenState(true);
    fixture.detectChanges();
    // 记录valueChange 触发次数
    let count = 0;
    // 监听valueChange事件
    component.eoValueChange.subscribe(() => count++);
    // 选中apple
    (document.querySelectorAll('eoui-option-item')[0] as HTMLElement).click();
    fixture.detectChanges();
    // 验证输出对象的值是否正确
    expect(outputObj.valueKey).toEqual('apple');
    // 验证是否触发了一次valueChange事件
    expect(count).toBe(1);
  });

  it('8.验证angular.js中数据数据边界处理', () => {
    component.eoOptions = [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' },
      { label: '梨子', value: 'pear' },
    ];
    // 设置无效默认值
    component.eoValue = null;
    component.ngOnInit();
    fixture.detectChanges();
    // 应为空
    expect(component.listOfValue).toEqual([]);
    // 设置不存在的默认值
    component.eoValue = 'orange';
    // 应为空
    expect(component.listOfValue).toEqual([]);
  });
  // ---------- 以下为对angular.js兼容性的测试 end ----------
  it('9.验证动态修改数据是否被监听到', async () => {
    const data = generateMockData(100);
    component.eoOptions = data;
    component.ngOnInit();
    await sleep(100);
    // 后续push一条数据
    data.push({ label: 100, value: 100 });
    // 由于取消了docheck的使用，改为在打卡下拉框时才更新options列表所以 这里主动更新一次
    component.initOptions()
    fixture.detectChanges();
    // 验证是否监听到更新
    expect(component.listOfOption.length).toBe(101);
    // 修改默认值为第101条数据
    component.eoValue = 100;
    // ngOnChanges 只会在父组件内数据传入有变更时才会触发 https://stackoverflow.com/questions/37408801/testing-ngonchanges-lifecycle-hook-in-angular-2
    // 这里模拟触发一下ngOnChanges
    component.ngOnChanges({
      eoValue: new SimpleChange(undefined, component.eoValue, false),
    });
    fixture.detectChanges();
    // 验证是否监听到更新
    expect(component.listOfValue).toEqual([100]);
  });

  it('10.搜索框是否按正常逻辑出现', async () => {
    // 搜索框默认为超过7条数据时出现
    const data = generateMockData(7);
    component.eoOptions = data;
    component.setOpenState(true)
    fixture.detectChanges();

    let searchEl = document.querySelector('.eoui-select-search');
    // 验证是搜索框是否按预期隐藏
    expect(searchEl).toBeNull();

    // 设置出现搜索框
    component.eoShowSearch = true;
    component.ngOnChanges({
      eoShowSearch: new SimpleChange(undefined, component.eoShowSearch, false),
    });
    fixture.detectChanges();
    searchEl = document.querySelector('.eoui-select-search');
    // 再次验证是搜索框是否按预期出现
    expect(searchEl).not.toBeNull();

    await sleep(100);
    // 设置不出现搜索框， 此设置会无视默认值
    component.eoShowSearch = false;
    data.push({ label: 7, value: 7 });
    // 由于取消了docheck的使用，改为在打卡下拉框时才更新options列表所以 这里主动更新一次
    component.initOptions()
    fixture.detectChanges();
    searchEl = document.querySelector('.eoui-select-search');
    // 再次验证是搜索框是否按预期隐藏
    expect(searchEl).toBeNull();

    // 重置为undefined
    component.eoShowSearch = undefined;
    component.ngOnChanges({
      eoShowSearch: new SimpleChange(undefined, component.eoShowSearch, false),
    });
    fixture.detectChanges();
    searchEl = document.querySelector('.eoui-select-search');
    // 再次验证是搜索框是否按预期出现
    expect(searchEl).not.toBeNull();
  });

  it('11.测试多选时必填选项是否正常', () => {
    const data = generateMockData(10);
    component.eoOptions = data;
    component.eoMode = 'multiple';
    component.eoIsRequired = true;
    // 默认选择第二条数据
    component.eoValue = [1];
    component.open = true;
    component.ngOnInit();
    fixture.detectChanges();

    // 取消选中第二数据
    (document.querySelectorAll('eoui-option-item')[1] as HTMLElement).click();
    fixture.detectChanges();
    // 验证是否未被取消
    expect(component.listOfValue).toEqual([1]);
    // 取消必填项
    component.eoIsRequired = false;
    // 再次取消选中第二数据
    (document.querySelectorAll('eoui-option-item')[1] as HTMLElement).click();
    fixture.detectChanges();
    // 验证是否被取消
    expect(component.listOfValue).toEqual([]);
    const selectAllBtn = document.querySelector('.eoui-select-search .eoui-select-checkbox') as HTMLElement;
    // 全选
    selectAllBtn.click();
    expect(component.listOfValue.length).toBe(10);
    fixture.detectChanges();
    // 设置为必填项
    component.eoIsRequired = true;
    // 取消全选
    selectAllBtn.click();
    fixture.detectChanges();
    // 此时应默认选择第一条数据
    expect(component.listOfValue).toEqual([0]);
    (document.querySelectorAll('eoui-option-item')[1] as HTMLElement).click();
    fixture.detectChanges();
    expect(component.listOfValue).toEqual([0, 1]);
  });

  it('12.测试虚拟滚动功能', () => {
    const data = generateMockData(100);
    component.eoOptions = data;
    component.open = true;
    component.ngOnInit();
    fixture.detectChanges();
    const scrollEl = document.querySelector('.eoui-option-scroll') as HTMLElement;
    // 模拟滚动10次
    for (let i = 1; i < 10; ++i) {
      scrollEl.scrollTop += 1000;
      scrollEl.dispatchEvent(new Event('scroll'));
    }
    fixture.detectChanges();
    const optionItems = document.querySelectorAll('eoui-option-item');
    // 应出现100条下拉项
    expect(optionItems.length).toBe(100);
  });

  it('13.测试禁用功能', () => {
    const data = generateMockData(10);
    component.eoOptions = data;
    component.eoDisabled = true;
    component.ngOnInit();
    fixture.detectChanges();
    const selectTopControlEl = compiled.querySelector('eoui-select-top-control');
    selectTopControlEl.click();
    fixture.detectChanges();
    // 点不应该出现下拉框
    expect(document.querySelector('eoui-option-container')).toBeNull();
    component.eoDisabled = false;
    component.ngOnChanges({
      eoDisabled: new SimpleChange(undefined, component.eoDisabled, false),
    });
    selectTopControlEl.click();
    fixture.detectChanges();
    // 点不应该出现下拉框
    expect(document.querySelector('eoui-option-container')).not.toBeNull();
  });
});

function generateMockData(n: number): EoUiSelectOptionInterface[] {
  const mockData = [...new Array(n)].map((_, i) => ({
    label: i,
    value: i,
  }));
  return mockData;
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
// 执行用例前删除之前未销毁的下拉框dom
function resetState() {
  const containerEl = document.querySelector('eoui-option-container');
  containerEl?.parentElement?.removeChild(containerEl);
}
