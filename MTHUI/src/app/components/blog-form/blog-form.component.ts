import { Component, ChangeDetectionStrategy, input, output, effect, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BlogPost } from '../../models/blog-post.model';

declare var Quill: any;

@Component({
  selector: 'app-blog-form',
  standalone: true,
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class BlogFormComponent implements AfterViewInit {
  post = input<BlogPost | null>(null);
  save = output<Partial<BlogPost>>();
  cancel = output<void>();

  @ViewChild('editor') editorEl!: ElementRef;
  private quill: any;
  private isEditorInitialized = false;

  private fb: FormBuilder = inject(FormBuilder);

  // Helper to format date as yyyy-MM-dd
  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  blogForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    date: [this.formatDateForInput(new Date()), Validators.required],
    excerpt: ['', Validators.required],
    content: ['', Validators.required],
    imageUrl: [''],
    isFeatured: [false]
  });

  constructor() {
    effect(() => {
      const currentPost = this.post();
      if (currentPost) {
        // Exclude content from patchValue, as it will be handled by the editor
        const { content, ...postData } = currentPost;
        this.blogForm.patchValue({
          ...postData,
          date: this.formatDateForInput(new Date(currentPost.date)),
          isFeatured: currentPost.isFeatured ?? false
        });

        if (this.isEditorInitialized) {
          this.quill.clipboard.dangerouslyPasteHTML(content || '');
        } else {
          // If editor is not ready, set the form control value.
          // The editor will pick it up when it initializes.
          this.blogForm.get('content')?.setValue(content || '');
        }
      } else {
        this.blogForm.reset({
          title: '',
          author: '',
          date: this.formatDateForInput(new Date()),
          excerpt: '',
          content: '',
          imageUrl: '',
          isFeatured: false
        });
        if (this.isEditorInitialized) {
          // If resetting form, also clear editor content.
          this.quill.setText('');
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.editorEl) {
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ];

      this.quill = new Quill(this.editorEl.nativeElement, {
        modules: {
          toolbar: toolbarOptions
        },
        theme: 'snow',
        placeholder: 'Start writing your amazing blog post here...'
      });

      // Set initial content from form control, which might have been set by the effect
      const initialContent = this.blogForm.get('content')?.value;
      if (initialContent) {
        this.quill.clipboard.dangerouslyPasteHTML(initialContent);
      }

      this.isEditorInitialized = true;

      // Listen for changes and update the form control
      this.quill.on('text-change', () => {
        const content = this.quill.root.innerHTML;
        // Quill's empty state is '<p><br></p>', treat it as an empty string for validation
        const finalContent = content === '<p><br></p>' ? '' : content;
        this.blogForm.get('content')?.setValue(finalContent, { emitEvent: false });
        this.blogForm.get('content')?.markAsTouched();
      });
    }
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.blogForm.patchValue({ imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.blogForm.patchValue({ imageUrl: '' });
  }

  onSubmit() {
    if (this.blogForm.valid) {
      const formValue = { ...this.blogForm.getRawValue() };
      this.save.emit(formValue as Partial<BlogPost>);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
