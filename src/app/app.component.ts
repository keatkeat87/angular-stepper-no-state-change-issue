import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  duplicateByPass = true;

  @ViewChild('stepper', { static: false, read: MatStepper })
  stepper: MatStepper;

  loading = false;
  ngOnInit() {
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: this.formBuilder.control('', {
        asyncValidators: (firstCtrl: FormControl) => {
          if (this.duplicateByPass) {
            return of(null).pipe(delay(1000));
          } else {
            return of({ isDuplicate: true }).pipe(delay(1000));
          }
        }
      })
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['']
    });
  }
  submit() {
    this.duplicateByPass = false;
    this.loading = true;
    this.firstFormGroup.get('firstCtrl').updateValueAndValidity();
    this.firstFormGroup.get('firstCtrl').statusChanges.subscribe(() => {
      this.loading = false;
      this.cdr.markForCheck();
      // this.stepper._stateChanged();
    });
  }
}
