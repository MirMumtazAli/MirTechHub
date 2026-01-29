import { Component, ChangeDetectionStrategy, input, output, effect, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BlogPost } from '../../models/blog-post.model';

declare var Quill: any;

@Component({
  selector: 'app-blog-form',
  standalone: true,
  templateUrl: './blog-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class BlogFormComponent implements AfterViewInit {
  post = input<BlogPost | null>(null);
  save = output<Partial<BlogPost>>();
  cancel = output<void>();

  @ViewChild('contentEditor') contentEditorEl!: ElementRef;
  @ViewChild('excerptEditor') excerptEditorEl!: ElementRef;
  private quillContent: any;
  private quillExcerpt: any;
  private isContentEditorInitialized = false;
  private isExcerptEditorInitialized = false;

  private fb: FormBuilder = inject(FormBuilder);

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
        const { content, excerpt, ...postData } = currentPost;
        this.blogForm.patchValue({
          ...postData,
          date: this.formatDateForInput(new Date(currentPost.date)),
          isFeatured: currentPost.isFeatured ?? false
        });
        this.setContentEditorContent(content || '');
        this.setExcerptEditorContent(excerpt || '');
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
        this.setContentEditorContent('');
        this.setExcerptEditorContent('');
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.contentEditorEl) {
      this.initializeContentEditor();
    }
    if (this.excerptEditorEl) {
      this.initializeExcerptEditor();
    }
  }

  private initializeContentEditor() {
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ];
    this.quillContent = new Quill(this.contentEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Start writing your amazing blog post here...'
    });
    this.isContentEditorInitialized = true;

    const initialContent = this.blogForm.get('content')?.value;
    if (initialContent) {
      this.setContentEditorContent(initialContent);
    }

    this.quillContent.on('text-change', () => {
      const content = this.quillContent.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.blogForm.get('content')?.setValue(finalContent, { emitEvent: false });
      this.blogForm.get('content')?.markAsTouched();
    });
  }

  private initializeExcerptEditor() {
    const toolbarOptions = [['bold', 'italic', 'underline'], ['clean']];
    this.quillExcerpt = new Quill(this.excerptEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Write a short, engaging excerpt...'
    });
    this.isExcerptEditorInitialized = true;

    const initialContent = this.blogForm.get('excerpt')?.value;
    if (initialContent) {
      this.setExcerptEditorContent(initialContent);
    }

    this.quillExcerpt.on('text-change', () => {
      const content = this.quillExcerpt.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.blogForm.get('excerpt')?.setValue(finalContent, { emitEvent: false });
      this.blogForm.get('excerpt')?.markAsTouched();
    });
  }

  private setContentEditorContent(content: string) {
    if (this.isContentEditorInitialized) {
      this.quillContent.clipboard.dangerouslyPasteHTML(content);
    } else {
      this.blogForm.get('content')?.setValue(content);
    }
  }

  private setExcerptEditorContent(content: string) {
    if (this.isExcerptEditorInitialized) {
      this.quillExcerpt.clipboard.dangerouslyPasteHTML(content);
    } else {
      this.blogForm.get('excerpt')?.setValue(content);
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
