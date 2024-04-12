import { TemplateRef } from '@angular/core';

/**
 * 下拉框类型，多选或单选，默认单选
 */
export type EoUiSelectModeType = 'multiple' | 'default';

/**
 * 由用户传入的options数据格式类型
 */
export interface EoUiSelectOptionInterface {
  customContent?: boolean;

  template?: TemplateRef<any> | null;

  templateStr?: string;

  [key: string]: any;
}
export interface EoUiSelectItemInterface extends EoUiSelectOptionInterface {
  label: string;

  value: any | null;
}
