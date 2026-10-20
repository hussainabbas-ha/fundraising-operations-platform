import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../_services/dataServices/product.service';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { lookupData, Variants } from '../../../core/modals';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  _id: string = '';
  selectVendor: lookupData[] = [];
  variants: Variants[] = [];
  addVariant: boolean = false;
  index: number = -1;
  routQSub: Subscription;
  queryParams: Params | undefined;
  images: any = [];
  imagePreview: string | undefined = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private productService: ProductService,
    private lookupService: LookupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleProduct(this._id);
    }
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
      this.index = qparams['index'] ? qparams['index'] : -1;
    });
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      sellingPrice: [0, Validators.required],
      costPrice: [0, [Validators.required,]],
      isActive: [true, [Validators.required]],
      vendorId: [''],
      varName: [''],
      varSell: [''],
      varCost: [''],

    });
    this.getVendorsLookup();
  }
  ngOnInit(): void {

  }


  getSingleProduct(id: string) {
    const sub = this.productService.getSingleProduct(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.variants = res['data'].variants ? res['data'].variants : [];
        if (this.variants.length > 0) {
          this.addVariant = !this.addVariant;
        }
        this.imagePreview = data?.image;
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          sellingPrice: data?.sellingPrice ? data?.sellingPrice : '',
          costPrice: data?.costPrice ? data?.costPrice : '',
          isActive: data?.isActive ? data?.isActive : '',
          vendorId: data?.vendorId ? data?.vendorId : ''
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  addvariant() {
    const data = this.form.value;
    const single = {
      name: data?.varName,
      sellingPrice: data?.varSell,
      costPrice: data?.varCost
    };
    if (this.index != -1) {
      let index = Number(this.index);
      if (this.variants[index]) {
        this.variants[index] = { ...single };
      }
    }
    else {
      this.variants.push(single);
    }
    this.router.navigate([], { queryParams: {} });
    this.form.controls['varName'].reset();
    this.form.controls['varSell'].reset();
    this.form.controls['varCost'].reset();
  }
  removeVariant(item: Variants) {
    const index = this.variants.indexOf(item);
    if (index !== -1) {
      this.variants.splice(index, 1);
    }
  }

  editVariant(item: Variants, i: number) {
    this.form.patchValue({
      varName: item?.name,
      varSell: item.sellingPrice,
      varCost: item.costPrice,
    });
    this.router.navigate([], { queryParams: { index: i } });
  }

  submit() {
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.variants = this.variants;
      delete data.varName;
      delete data.varCost;
      delete data.varSell;
      if (this._id != '' && this._id != undefined) {
        const sub = this.productService.createOrUpdateProduct(this.images, data, this._id).subscribe({
          next: (res) => {
            this.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.productService.createOrUpdateProduct(this.images,data).subscribe({
          next: (res) => {
            this.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }

  getVendorsLookup() {
    const sub = this.lookupService.getVendorsLookup().subscribe({
      next: (res) => {
        this.selectVendor = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  close() {
    this.dialogRef.close();
  }

  selectImage(event: any) {
    this.images = [];
    const file = event.target.files[0];
    this.images.push(file);
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }

  }
  ngOnDestroy(): void {
    this.routQSub.unsubscribe();
  }
}
