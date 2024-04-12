import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'eoui-select-top-control',
  exportAs: 'eoSelectTopControl',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!-- 当前选择的项 -->
    <div class="eoui-select-item-wrap">
      <span class="eoui-select-placeholder" *ngIf="isEmpty">请选择...</span>
      <span>{{ selectedLabelStr }}</span>
    </div>

    <span class="eoui-select-arrow" *ngIf="!isShowCloseIcon">
      <i class="iconfont icon-chevron-down"></i>
    </span>

    <span class="eoui-select-close" *ngIf="isShowCloseIcon" (click)="handleClear($event)">
      <i class="iconfont icon-guanbi"></i>
    </span>
  `,
  host: {
    class: 'eoui-select-top-control',
  },
})
export class EoUiSelectTopControlComponent implements OnChanges {
  /**
   * 是否禁用
   */
  @Input() isDisabled = false;
  /**
   * 是否允许清除
   */
  @Input() isAllowClear = false;
  /**
   * 选择项的label名称
   */
  @Input() selectedLabels: string[] = [];

  /**
   * 点击清除按钮时触发
   */
  @Output() clear = new EventEmitter<void>();
  /**
   * 是否显示清除图标
   */
  isShowCloseIcon = false;

  selectedLabelStr = '';

  isEmpty = true;

  constructor(private cdr: ChangeDetectorRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    const { isAllowClear, selectedLabels } = changes;
    if (isAllowClear || selectedLabels) {
      this.isShowCloseIcon = this.isAllowClear && this.selectedLabels.length > 0;
      this.cdr.markForCheck()
    }
    if (selectedLabels) {
      this.selectedLabelStr = this.selectedLabels.join('，');
      this.isEmpty = this.selectedLabels.length === 0;
      this.cdr.markForCheck()
    }
  }
  handleClear(e: Event) {
    e.stopPropagation();
    this.clear.emit();
  }
}
