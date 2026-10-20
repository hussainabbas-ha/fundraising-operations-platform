import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';


@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [NgxEditorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss'
})
export class TextEditorComponent implements OnInit {
  @Input() fControl!: FormControl;
  @Input() placeholderText:string = '';
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor() { 
    this.editor = new Editor();
  }

  ngOnInit(): void {
   
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
