import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { NetworkMapComponent } from './components/network-map/network-map.component';
import { DelayMonitorComponent } from './components/delay-monitor/delay-monitor.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    StatsCardComponent,
    NetworkMapComponent,
    DelayMonitorComponent,
    AiAssistantComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}