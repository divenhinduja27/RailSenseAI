import { Component } from '@angular/core';

@Component({
selector:'app-ai-assistant',
templateUrl:'./ai-assistant.component.html',
styleUrls:['./ai-assistant.component.css']
})
export class AiAssistantComponent {

query="";
response="";

askAI(){

this.response="Bhopal Junction currently has cascading delay risk.";

}

}