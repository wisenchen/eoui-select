import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
import { EoUiSelectModeType } from './select.types';

@Component({
  selector: 'eoui-option-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div *ngIf="isShowCheckBox && mode === 'multiple'" class="eoui-select-checkbox-wrap">
      <span
        [class]="isActivated ? 'eoui-select-checkbox iconfont icon-duihao' : 'eoui-select-checkbox iconfont'"
      ></span>
    </div>
    <div class="eoui-option-label">
      <ng-container *ngIf="!customContent">{{ label }}</ng-container>
      <ng-container *ngIf="customContent">
        <ng-template *ngIf="template" [ngTemplateOutlet]="template"></ng-template>
        <div *ngIf="templateStr" [outerHTML]="templateStr"></div>
      </ng-container>
    </div>
  `,
  host: {
    class: 'eoui-option-item',
    '[attr.title]': 'label',
    '[class]': 'isActivated ? "eoui-option-item eoui-option-item-active": "eoui-option-item"',
  },
})
export class OptionItemComponent {
  /**
   * 下拉框类型
   */
  @Input() mode: EoUiSelectModeType = 'default';
  /**
   * 是否自定义内容模板
   */
  @Input() customContent = false;
  /**
   * html模板
   */
  @Input() template: TemplateRef<any> | null = null;

  @Input() templateStr?: string;
  /**
   * 选项名称
   */
  @Input() label: string | number | null = null;
  /**
   * 选项值
   */
  @Input() value: any | null = null;
  /**
   * 是否显示复选框
   */
  @Input() isShowCheckBox = true;
  /**
   * 是否被选择
   */
  @Input() isActivated = false;
  /**
   * 发现当使用自定义元素（templateStr）插入内容并且经过angular的bypassSecurityTrustHtml过滤后发现以下问题
   * 1. mousedown存放的target(即插入元素) 会在mouseup事件触发后丢失(致使target不存在与页面中) 此时 elementRef.nativeElement.contains(el) 结果为false; 导致直接关闭下拉框
   * 2. click事件无法触发，经测试，手动绑定的事件也不会生效
   */
  // get safeHTML() {
  //   return this.sanitizer.bypassSecurityTrustHtml(this.templateStr || '');
  // }
}
