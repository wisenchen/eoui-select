import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { EoUiSelectModeType, EoUiSelectItemInterface } from './select.types';

@Component({
  selector: 'eoui-option-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="eoui-select-search" *ngIf="isShowSearch !== undefined ? isShowSearch : sourceOptions.length > 7">
      <div class="eoui-select-checkbox-wrap" *ngIf="isShowCheckBox && mode === 'multiple'">
        <span
          (click)="handleSelectAll()"
          [class]="isSelectAll ? 'eoui-select-checkbox iconfont icon-duihao' : 'eoui-select-checkbox iconfont'"
        ></span>
      </div>
      <span class="iconfont icon-sousuo eoui-select-search-icon"></span>
      <input
        type="text"
        class="eoui-select-search-input"
        [(ngModel)]="searchValue"
        (input)="onSearchValueChange($event)"
        placeholder="搜索"
      />
    </div>

    <div class="eoui-option-scroll" (scroll)="onOptionScroll($event)">
      <eoui-option-item
        *ngFor="let item of currentOptions"
        [label]="item.label"
        [value]="item.value"
        [mode]="mode"
        [customContent]="!!item.customContent"
        [template]="item.template || null"
        [templateStr]="item.templateStr"
        [isActivated]="selectedValues.includes(item.value)"
        (click)="handleItemClick(item.value)"
        [isShowCheckBox]="isShowCheckBox"
      ></eoui-option-item>
      <div class="eoui-select-empty-tips" *ngIf="currentOptions.length === 0">暂无数据</div>
    </div>
  `,
  host: {
    class: 'eoui-option-container',
  },
})
export class OptionContainerComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * 是否显示搜索框
   */
  @Input() isShowSearch? = false;
  /**
   * 是否显示复选框，只在 mode === multiple 情况下生效
   */
  @Input() isShowCheckBox = false;
  /**
   * 下拉菜单类型，多选或单选，默认单选
   */
  @Input() mode: EoUiSelectModeType = 'default';
  /**
   * 下拉菜单源数据
   */
  @Input() sourceOptions: EoUiSelectItemInterface[] = [];
  /**
   * 所有已选项的value
   */
  @Input() selectedValues: any[] = [];
  /**
   * 点击下拉项时触发
   */
  @Output() itemClick = new EventEmitter<EoUiSelectItemInterface>();
  /**
   * 选择所有时触发
   */
  @Output() selectAll = new EventEmitter<any[]>();
  /**
   * 加载完成事件
   */
  @Output() loadEvent = new EventEmitter<{ width: number; height: number }>();
  /**
   * 搜索结果下拉项
   */
  private searchOptions: EoUiSelectItemInterface[] = [];
  /**
   * 虚拟滚动距离底部距离多少则触发加载
   */
  private offsetBottom = 20;
  /**
   * 虚拟滚动 步长
   */
  private step = 10;
  /**
   * 当前显示在页面的选项
   */
  currentOptions: EoUiSelectItemInterface[] = [];
  /**
   * 输入框内容
   */
  searchValue = '';

  el?: HTMLElement;

  static parameters?: any[];

  constructor(elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
  }
  ngOnInit(): void {
    this.currentOptions = this.sourceOptions.slice(0, this.step);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sourceOptions) {
      this.currentOptions = this.allOptions.slice(0, this.step);
    }
  }
  handleSelectAll() {
    const currentVals = this.allOptions.map((item) => item.value);
    let values = this.selectedValues;
    // 取消全选则过滤所有选项
    if (this.isSelectAll) {
      values = this.selectedValues.filter((v) => !currentVals.includes(v));
    } else {
      values = values.concat(currentVals);
    }
    const listOfValue = this.sourceOptions.filter((item) => values.includes(item.value)).map((item) => item.value);
    this.selectAll.next(listOfValue);
  }

  onSearchValueChange(e: Event) {
    this.searchValue = (e.target as HTMLInputElement).value;
    this.searchOptions = this.sourceOptions.filter((item) =>
      item.label.toUpperCase().includes(this.searchValue.toUpperCase())
    );
    this.currentOptions = this.searchOptions.slice(0, this.step);
  }
  handleItemClick(value: any) {
    this.itemClick.next(value);
  }

  onOptionScroll(e: Event) {
    const el = e.target as HTMLElement;
    const maxScrollTop = el.scrollHeight - el.clientHeight;
    // 触发加载
    if (maxScrollTop - this.offsetBottom <= el.scrollTop) {
      const options = this.searchOptions.length ? this.searchOptions : this.sourceOptions;
      const currentOptions = this.currentOptions;
      this.currentOptions = currentOptions.concat(
        options.slice(currentOptions.length, currentOptions.length + this.step)
      );
    }
  }
  ngAfterViewInit() {
    if (this.el) {
      this.loadEvent.emit({
        width: this.el.offsetWidth,
        height: this.el.offsetHeight,
      });
    }
  }
  get isSelectAll() {
    return this.allOptions.every((v) => this.selectedValues.includes(v.value)) && this.allOptions.length > 0;
  }

  get allOptions() {
    return this.searchOptions.length ? this.searchOptions : this.sourceOptions;
  }
}
