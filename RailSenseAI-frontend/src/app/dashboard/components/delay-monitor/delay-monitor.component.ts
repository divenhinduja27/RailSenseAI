import { Component } from '@angular/core';

@Component({
selector:'app-delay-monitor',
templateUrl:'./delay-monitor.component.html',
styleUrls:['./delay-monitor.component.css']
})
export class DelayMonitorComponent {

delays=[

{station:"BPL",delay:45},
{station:"NDLS",delay:20},
{station:"NGP",delay:30}

];

}