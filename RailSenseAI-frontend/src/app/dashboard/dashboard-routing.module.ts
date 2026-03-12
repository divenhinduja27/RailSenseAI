import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { NetworkMapComponent } from './components/network-map/network-map.component';
import { DelayMonitorComponent } from './components/delay-monitor/delay-monitor.component';
import { AiAssistantComponent } from './components/ai-assistant/ai-assistant.component';

const routes: Routes = [

  { path: '', component: DashboardHomeComponent },

  { path: 'network', component: NetworkMapComponent },

  { path: 'delays', component: DelayMonitorComponent },

  { path: 'assistant', component: AiAssistantComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}