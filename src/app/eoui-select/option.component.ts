import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

/**
 * 模板组件，只用于接收参数，实际不会直接渲染
 */
@Component({
  selector: 'eoui-option',
  exportAs: 'eoOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class EoUiOptionComponent {
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<any>;

  @Input() eoLabel: string = '';

  @Input() eoValue: any | null = null;

  /**
   * 是否自定义内容模板
   */
  @Input() eoCustomContent = false;
}
