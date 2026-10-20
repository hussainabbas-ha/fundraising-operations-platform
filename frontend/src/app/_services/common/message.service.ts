import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PromptComponent } from '../../core/prompt/prompt.component';



@Injectable({
	providedIn: 'root'
})
export class MessageService {

	constructor(public matDialog: MatDialog, ) { }
	public prompt(message: string, config: MatDialogConfig = {}) {
		config.data = (config.data) ? config.data : {};
		config.data.message = message;
		if (!config.width) {
			config.width = '70vh';
		}
		config.position = {top: '50px'}
		return this.matDialog.open(PromptComponent, config);
	}
}


