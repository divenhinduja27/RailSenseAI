import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  styleUrls: ['./network-map.component.css']
})
export class NetworkMapComponent implements AfterViewInit {

ngAfterViewInit(): void {

new Chart("networkChart", {

type: 'line',

data: {

labels: ["NDLS","BPL","NGP","HYD","MAS"],

datasets: [{
label: 'Train Load',
data: [20,35,40,25,30],
borderColor: 'blue',
fill:false
}]

}

});

}

}