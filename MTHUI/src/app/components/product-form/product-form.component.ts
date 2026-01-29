import { Component, ChangeDetectionStrategy, input, output, effect, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

declare var Quill: any;

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class ProductFormComponent implements AfterViewInit {
  product = input<Product | null>(null);
  productType = input.required<'note' | 'software'>();
  save = output<Product>();
  cancel = output<void>();

  @ViewChild('detailsEditor') detailsEditorEl!: ElementRef;
  @ViewChild('descriptionEditor') descriptionEditorEl!: ElementRef;
  private quillDetails: any;
  private quillDescription: any;
  private isDetailsEditorInitialized = false;
  private isDescriptionEditorInitialized = false;

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
        const { details, description, ...productData } = currentProduct;
        this.productForm.patchValue({
          ...productData,
          isFree: currentProduct.price === 0,
          isFeatured: currentProduct.isFeatured ?? false,
          hasPdf: !!currentProduct.pdfUrl,
        });
        this.setDetailsEditorContent(details || '');
        this.setDescriptionEditorContent(description || '');

      } else {
        this.productForm.reset({ name: '', description: '', details: '', price: 0, isFree: false, hasPdf: false, pdfUrl: '', imageUrl: '', isFeatured: false });
        this.setDetailsEditorContent('');
        this.setDescriptionEditorContent('');
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
    if (this.detailsEditorEl) {
      this.initializeDetailsEditor();
    }
    if (this.descriptionEditorEl) {
      this.initializeDescriptionEditor();
    }
  }

  private initializeDescriptionEditor() {
    const toolbarOptions = [['bold', 'italic', 'underline'], ['clean']];
    this.quillDescription = new Quill(this.descriptionEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Write a short, engaging summary...'
    });
    this.isDescriptionEditorInitialized = true;

    const initialContent = this.productForm.get('description')?.value;
    if (initialContent) {
      this.setDescriptionEditorContent(initialContent);
    }

    this.quillDescription.on('text-change', () => {
      const content = this.quillDescription.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.productForm.get('description')?.setValue(finalContent, { emitEvent: false });
      this.productForm.get('description')?.markAsTouched();
    });
  }

  private initializeDetailsEditor() {
    const toolbarOptions = [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ];

    this.quillDetails = new Quill(this.detailsEditorEl.nativeElement, {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
      placeholder: 'Enter the full details for the product here...'
    });
    this.isDetailsEditorInitialized = true;

    const initialContent = this.productForm.get('details')?.value;
    if (initialContent) {
      this.setDetailsEditorContent(initialContent);
    }

    this.quillDetails.on('text-change', () => {
      const content = this.quillDetails.root.innerHTML;
      const finalContent = content === '<p><br></p>' ? '' : content;
      this.productForm.get('details')?.setValue(finalContent, { emitEvent: false });
      this.productForm.get('details')?.markAsTouched();
    });
  }

  private setDetailsEditorContent(content: string) {
    if (this.isDetailsEditorInitialized) {
      this.quillDetails.clipboard.dangerouslyPasteHTML(content);
    } else {
      this.productForm.get('details')?.setValue(content);
    }
  }

  private setDescriptionEditorContent(content: string) {
    if (this.isDescriptionEditorInitialized) {
      this.quillDescription.clipboard.dangerouslyPasteHTML(content);
    } else {
      this.productForm.get('description')?.setValue(content);
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
