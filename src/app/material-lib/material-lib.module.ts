import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//ANGULAR MATERIAL IMPORT
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

const MaterialModuleComponents = [
  MatSliderModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatDialogModule,
  MatDividerModule,
  MatListModule
];

@NgModule({
  imports: [CommonModule, MaterialModuleComponents],
  exports: [MaterialModuleComponents],
})
export class MaterialLibModule {}
