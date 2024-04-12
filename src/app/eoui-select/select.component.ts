import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { EoUiOptionComponent } from './option.component';
import {
  EoUiSelectOptionInterface,
  EoUiSelectModeType,
  EoUiSelectItemInterface
} from './select.types'

@Component({
  selector: 'eoui-select',
  exportAs: 'eouiSelect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EouiSelectComponent),
      multi: true
    }
  ],
  template: `
    <eoui-select-top-control
      [isDisabled]="eoDisabled"
      [isAllowClear]="eoAllowClear"
      [selectedLabels]="selectedLabels"
      (clear)="handleClear()"
      (click)="handleSelectTopClick()"
    ></eoui-select-top-control>
    <eoui-option-container
      *ngIf="open"
      [ngStyle]="{
        width: optionContainerWidth,
        top: offsetTop,
        left: offsetLeft,
        opacity: isShowContainer
      }"
      (loadEvent)="handleContainerLoad($event)"
      [isShowSearch]="eoShowSearch"
      [isShowCheckBox]="eoShowCheckBox"
      [mode]="eoMode"
      [sourceOptions]="listOfOption"
      [selectedValues]="listOfValue"
      (itemClick)="handleOptionItemClick($event)"
      (selectAll)="handleSelectAll($event)"
    ></eoui-option-container>
  `,
  host: {
    // angularjs不支持这种方式设置class
    // class: 'eoui-select',
    // '[class.el-select-multiple]': 'eoMode === "multiple"',
    // '[class.eoui-select-disabled]': 'eoDisabled',
    '[class]': 'elClassName'
  }
})
export class EouiSelectComponent
  implements ControlValueAccessor, OnInit, AfterContentInit, OnDestroy, OnChanges {
  @Input() eoOptionConfig: { labelKey: string; valueKey: string } = {
    labelKey: 'label',
    valueKey: 'value'
  };

  /**
   * 下拉选项数据
   */
  @Input() eoOptions: EoUiSelectOptionInterface[] = [];

  /**
   * 下拉菜单类型，多选或单选，默认单选
   */
  @Input() eoMode: EoUiSelectModeType = 'default';
  /**
   * 是否出现有清除按钮
   */
  @Input() eoAllowClear = false;

  /**
   * 是否显示搜索框
   */
  @Input() eoShowSearch?: boolean;
  /**
   * 下拉框容器宽带 单位为px 最小宽度为与选择器相同
   */
  @Input() eoOptionContainerWidth?: number;

  /**
   * 是否显示复选框，只在 mode === multiple 情况下生效
   */
  @Input() eoShowCheckBox = true;

  /**
   * 是否禁用
   */
  @Input() eoDisabled = false;

  /**
   * 用于同步数据 替代双向绑定   start
   */
  @Input() eoValue: any;
  @Input() eoOutput: any;
  @Input() eoModelKey = '';
  /**
   * 用于同步数据 替代双向绑定  end
   */
  @Input() eoIsRequired: Boolean = false;
  /**
   * 下拉框展开和收起时触发
   */

  @Output() readonly eoOpenChange = new EventEmitter<boolean>();

  /**
   * ngModelChange在angular.js里触发不了， 这里自定义一个时间触发更新
   */
  @Output() readonly eoValueChange = new EventEmitter<boolean>();

  /**
   * 内容插槽定义
   */
  @ContentChildren(EoUiOptionComponent, { descendants: true })
  listOfEoOptionComponent!: QueryList<EoUiOptionComponent>;

  /**
   * 用于双向数据绑定中触发更新
   */
  onChange: (value: any) => void = () => { };
  /**
   * 私有value 用于接收ngModel 传入的值
   */
  private value: any;

  /**
   * 是否是内嵌模板形式渲染，如果传入eoOptions 则为false
   */
  private isContentOption = true;
  /**
   * 流 已选中value列表
   */
  private listOfValue$ = new BehaviorSubject<any[]>([]);
  /**
   * 流 内嵌option模板
   */
  private listOfTemplateItem$ = new BehaviorSubject<EoUiSelectItemInterface[]>([]);
  /**
   * 流 内嵌option模板
   */
  private options$ = new BehaviorSubject<EoUiSelectOptionInterface[]>([]);
  /**
   * 组件内使用, 转换成EoUiSelectItemInterface 的option
   */
  listOfOption: EoUiSelectItemInterface[] = [];
  /**
   * 已选中value列表
   */
  listOfValue: any[] = [];
  /**
   * 已选中数据列表
   */
  listOfItem: EoUiSelectItemInterface[] = [];

  /**
   * 下拉框展开/收起状态
   */
  open = false;

  /**
   * 取消订阅
   */
  unsubscribe$ = new Subject<void>();

  offsetTop = '0px';

  offsetLeft = '0px';

  isShowContainer = 0;

  elClassName = '';

  optionContainerWidth = ''

  selectedLabels: string[] = [];

  elOfobserver?: ResizeObserver;

  defaultWidth?: number;

  el?: HTMLElement;

  private handleMousedown = (e: MouseEvent) => {
    e.stopPropagation();
    this.currentMouseEventEl = e.target as Node;
    if (e.button !== 0) return;
    const containerEl = document.getElementsByClassName('eoui-option-container')[0];
    if (!containerEl.contains(this.currentMouseEventEl)) {
      this.setOpenState(false);
    }
  };

  private handleMouseup = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const containerEl = document.getElementsByClassName('eoui-option-container')[0];
    if (!this.currentMouseEventEl || !containerEl.contains(this.currentMouseEventEl)) {
      this.setOpenState(false);
    }
    this.currentMouseEventEl = undefined;
  };

  private currentMouseEventEl: Node | undefined;
  constructor(private cdr: ChangeDetectorRef, elementRef: ElementRef) {
    this.el = elementRef.nativeElement;
    this.onResize(elementRef.nativeElement);
    // 这里加一个click阻止冒泡
    this.el?.addEventListener('click', (e: Event) => e.stopPropagation())
  }

  onResize(el: HTMLElement) {
    // 单元测试环境下 无ResizeObserver 变量
    if (typeof ResizeObserver === 'undefined') return
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        this.defaultWidth = entry.contentRect.width;
        this.optionContainerWidth = (this.eoOptionContainerWidth || this.defaultWidth) + 'px'
        this.cdr.markForCheck()
      }
    })
    resizeObserver.observe(el)
    this.elOfobserver = resizeObserver
  }

  ngOnInit(): void {
    if (this.eoOptions) {
      this.initOptions();
    }
    this.writeValue(this.eoValue)
    combineLatest([this.listOfValue$, this.listOfTemplateItem$, this.options$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([listOfSelectedValue, listOfTemplateItem, options]) => {
        if (listOfTemplateItem.length) {
          this.listOfOption = listOfTemplateItem
        }
        this.listOfItem = this.listOfOption.filter(
          (item) =>
            // 由于默认值和value数据类型有不一致的情况所以这里使用==判断 替代includes
            listOfSelectedValue.find((v) => item.value == v) !== undefined,
        );
        this.selectedLabels = this.listOfItem.map((item) => item.label);
      });
  }

  initOptions() {
    if (this.eoOptions?.length > 0) {
      this.listOfOption = this.eoOptions.map((item) => ({
        ...item,
        label: item[this.eoOptionConfig.labelKey],
        value: item[this.eoOptionConfig.valueKey],
      }));
      this.isContentOption = false;
      this.writeValue(this.eoValue);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { eoValue, eoOptions, eoOpen, eoDisabled, eoMode } = changes;
    if (eoValue) {
      this.writeValue(eoValue.currentValue)
    }
    if (eoOptions) {
      this.initOptions()
    }
    if (eoOpen || eoDisabled || eoMode) {
      this.updateElclassName();
    }
    this.cdr.markForCheck();
  }

  handleSelectTopClick() {
    if (this.eoDisabled) return;
    this.setOpenState(!this.open);
  }

  handleContainerLoad({ width, height }: { width: number; height: number }) {
    if (this.open) {
      const DOMRect = this.el?.getBoundingClientRect()
      if (DOMRect && this.el) {
        const { top, left, bottom } = DOMRect
        let offsetTop = top + this.el.clientHeight
        let offsetLeft = left
        if (window.innerHeight - bottom < height) {
          offsetTop = top - height - 5
        }
        if (window.innerWidth - left < width) {
          offsetLeft = left - width
        }
        const containerEl = this.el?.getElementsByClassName('eoui-option-container')[0];
        containerEl.parentElement?.removeChild(containerEl);
        document.body.appendChild(containerEl)
        setTimeout(() => {
          this.offsetTop = offsetTop + 'px';
          this.offsetLeft = offsetLeft + 'px';
          this.isShowContainer = 1;
          this.cdr.markForCheck()
        });
      }
    }
  }

  setOpenState(open: boolean) {
    if (this.open === open) return;
    // 只在下拉框展开的时候注册事件，避免当页面同时出现过多的下拉选项注册了太多的事件
    if (open) {
      document.addEventListener('mousedown', this.handleMousedown);
      document.addEventListener('mouseup', this.handleMouseup);
      // 由于eoOpetions 传入的可能是引用值所以NgOnChanges监听不到修改，所以这里在打开弹窗前同步一次最新的options数据
      this.initOptions()
    } else {
      // 在弹窗关闭时取消监听
      document.removeEventListener('mousedown', this.handleMousedown);
      document.removeEventListener('mouseup', this.handleMouseup);
    }
    this.open = open;
    this.eoOpenChange.emit(this.open);
    this.cdr.markForCheck();
    this.updateElclassName();
  }

  handleClear() {
    this.updateListOfValue([])
  }

  handleOptionItemClick(value: any) {
    if (this.eoMode === 'default') {
      this.updateListOfValue([value])
      this.setOpenState(false)
    } else if (this.eoMode === 'multiple') {
      let listOfValue = [...this.listOfValue]
      const index = listOfValue.indexOf(value)
      if (index > -1) {
        // 如果是必选情况下取消选中,且此时只有一个已选项时则不能取消
        if (this.eoIsRequired && this.listOfValue.length === 1) {
          return
        }
        listOfValue.splice(index, 1)
      } else {
        const selectedValues = [...listOfValue, value]
        /**
         * 与下拉列表保持相对顺序， 即按照下拉选项的顺序排列
         */
        listOfValue = this.listOfOption
          .filter((v) => selectedValues.includes(v.value))
          .map((item) => item.value)
      }
      this.setOpenState(true)
      this.updateListOfValue(listOfValue)
    }
  }

  handleSelectAll(listOfValue: any[]) {
    if (this.eoIsRequired && listOfValue.length === 0) {
      listOfValue = [this.listOfOption[0].value]
    }
    this.updateListOfValue(listOfValue)
  }

  updateListOfValue(listOfValue: any[]) {
    const covertListToModel = (list: any[], mode: EoUiSelectModeType): any[] | any => {
      if (mode === 'default') {
        return list.length ? list[0] : null
      }
      return list
    }
    const model = covertListToModel(listOfValue, this.eoMode)
    if (this.value !== model) {
      this.listOfValue = listOfValue
      this.listOfValue$.next(listOfValue)
      this.value = model
      if (this.eoModelKey) {
        this.eoOutput[this.eoModelKey] = this.value
      }
      this.eoValueChange.emit(this.value);
      this.onChange(this.value);
      this.cdr.markForCheck()
    }
  }

  /**
   * 数据双向绑定处理 start
   */
  writeValue(modelValue: any | any[]): void {
    if (this.value !== modelValue) {
      this.value = modelValue
    }
    const covertModelToList = (model: any[] | any, mode: EoUiSelectModeType): any[] => {
      if (model === null || model === undefined) {
        return []
      } else if (mode === 'default') {
        return [model]
      } else {
        return model
      }
    };
    const listOfValue = covertModelToList(modelValue, this.eoMode);
    this.listOfValue = listOfValue;
    this.listOfValue$.next(listOfValue);
    if (this.eoModelKey && typeof this.eoOutput === 'object') {
      this.eoOutput[this.eoModelKey] = this.value;
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void { }
  /**
   * 数据双向绑定处理 end
   */

  ngAfterContentInit() {
    if (!this.isContentOption) return
    this.listOfEoOptionComponent.changes
      .pipe(startWith(true), takeUntil(this.unsubscribe$))
      .subscribe(() => {
        const listOfOptionInterface = this.listOfEoOptionComponent.toArray().map((item) => {
          const { template, eoLabel, eoValue, eoCustomContent } = item
          return {
            template,
            label: eoLabel,
            value: eoValue,
            customContent: eoCustomContent
          }
        })
        this.listOfTemplateItem$.next(listOfOptionInterface)
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.elOfobserver?.disconnect();
    document.removeEventListener('mousedown', this.handleMousedown);
    document.removeEventListener('mouseup', this.handleMouseup);
  }

  updateElclassName() {
    let defaultClass = 'eoui-select';
    if (this.open) {
      defaultClass += ' eoio-select-open'
    }
    if (this.eoMode === 'multiple') {
      defaultClass += ' eoui-select-multiple'
    }
    if (this.eoDisabled) {
      defaultClass += ' eoui-select-disabled'
    }
    this.elClassName = defaultClass;
  }

}
