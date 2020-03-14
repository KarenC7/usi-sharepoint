import { Component, Input, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ControlValueAccessor, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-image-upload-control',
  templateUrl: './image-upload-control.component.html',
  styleUrls: ['./image-upload-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadControlComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageUploadControlComponent),
      multi: true
    }
  ]
})
export class ImageUploadControlComponent implements ControlValueAccessor, OnDestroy, OnInit {
  disabled: boolean;
  firstChange = false;
  imageGroup: FormGroup;
  @Input() label: string;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder
  ) {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
    this.setupForm();

    this.subscriptions.push(
      this.imageGroup.valueChanges.subscribe(value => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onChange: any = (_: any) => {};
  onTouched: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(_: FormControl) {
    return this.imageGroup.valid ? null : { imageGroup: { valid: false } };
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.imageGroup.reset();
    }
  }

  // Custom public methods

  onDelete() {
    this.value = {
      data: null,
      name: null,
      type: null
    };
  }

  onFileChanged(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.value = {
        data: reader.result,
        name: file.name,
        type: file.type
      };
    };
  }

  // Custom private methods

  private imageValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      return group.value.name ? null : { imageValidator: true };
    }
  }

  private setupForm() {
    this.imageGroup = this.fb.group({
      data: null,
      name: null,
      type: null
    });
  }

  private setValidation(value: boolean) {
    if (value) {
      this.imageGroup.setValidators(this.imageValidator());
      this.imageGroup.markAsUntouched();
    } else {
      this.imageGroup.clearValidators();
    }

    this.imageGroup.updateValueAndValidity();
  }

  // Getters and setters

  get name() {
    return this.imageGroup.get('name');
  }

  set required(value: boolean) {
    this.setValidation(value);
  }

  get value() {
    return this.imageGroup.value;
  }

  set value(value) {
    this.firstChange = true;
    this.imageGroup.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

}
