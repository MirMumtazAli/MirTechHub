import { Component, ChangeDetectionStrategy, input, output, effect, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

declare var Quill: any;

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class ProductFormComponent implements AfterViewInit {
  product = input<Product | null>(null);
  productType = input.required<'note' | 'software'>();
  save = output<Product>();
  cancel = output<void>();

  @ViewChild('editor') editorEl!: ElementRef;
  private quill: any;
  private isEditorInitialized = false;

  private fb: FormBuilder = inject(FormBuilder);

  productForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    details: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    isFree: [false],
    hasPdf: [false],
    pdfUrl: [''],
    imageUrl: [''],
    isFeatured: [false]
  });

  constructor() {
    effect(() => {
      const currentProduct = this.product();
      if (currentProduct) {
        const { details, ...productData } = currentProduct;
        this.productForm.patchValue({
          ...productData,
          isFree: currentProduct.price === 0,
          isFeatured: currentProduct.isFeatured ?? false,
          hasPdf: !!currentProduct.pdfUrl,
        });
        this.setEditorContent(details || '');

      } else {
        this.productForm.reset({ name: '', description: '', details: '', price: 0, isFree: false, hasPdf: false, pdfUrl: '', imageUrl: '', isFeatured: false });
        this.setEditorContent('');
      }
    });

    this.productForm.get('isFree')?.valueChanges.subscribe(isFree => {
      const priceControl = this.productForm.get('price');
      if (isFree) {
        priceControl?.setValue(0);
        priceControl?.disable();
      } else {
        priceControl?.enable();
      }
    });

    this.productForm.get('hasPdf')?.valueChanges.subscribe(hasPdf => {
      if (!hasPdf) {
        this.productForm.get('pdfUrl')?.setValue('');
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
        placeholder: 'Enter the full details for the product here...'
      });
      this.isEditorInitialized = true;

      const initialContent = this.productForm.get('details')?.value;
      if (initialContent) {
        this.setEditorContent(initialContent);
      }

      this.quill.on('text-change', () => {
        const content = this.quill.root.innerHTML;
        const finalContent = content === '<p><br></p>' ? '' : content;
        this.productForm.get('details')?.setValue(finalContent, { emitEvent: false });
        this.productForm.get('details')?.markAsTouched();
      });
    }
  }

  private setEditorContent(content: string) {
    if (this.isEditorInitialized) {
      this.quill.clipboard.dangerouslyPasteHTML(content);
    } else {
      this.productForm.get('details')?.setValue(content);
    }
  }

  onFileSelected(event: Event, controlName: 'pdfUrl' | 'imageUrl') {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productForm.patchValue({ [controlName]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.productForm.patchValue({ imageUrl: '' });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.getRawValue();
      const { isFree, hasPdf, ...productData } = formValue;

      let productToSave: Product;

      if (this.product()) {
        // Editing existing product
        productToSave = {
          ...this.product()!,
          ...productData
        };
      } else {
        // Creating new product
        productToSave = {
          ...productData,
          id: 0, // Placeholder ID for creation
          type: this.productType(),
          imageGallery: [],
        } as Product;
      }

      this.save.emit(productToSave);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
