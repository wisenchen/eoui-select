import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EouiSelectComponent } from './select.component';
import { FormsModule } from '@angular/forms';
import { OptionItemComponent } from './option-item.component';
import { OptionContainerComponent } from './option-container.component';
import { EoUiOptionComponent } from './option.component';
import { EoUiSelectTopControlComponent } from './select-top-control.component';
@NgModule({
  declarations: [
    EouiSelectComponent,
    OptionItemComponent,
    OptionContainerComponent,
    EoUiOptionComponent,
    EoUiSelectTopControlComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [EouiSelectComponent, EoUiOptionComponent],
  entryComponents: [EouiSelectComponent, EoUiOptionComponent]
})
export class EouiSelectModule {}
