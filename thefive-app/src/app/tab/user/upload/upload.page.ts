import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {
  
  permuteFile: File;
  uploadForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.uploadForm = this.formBuilder.group({
      caption: ['', [Validators.required]],
      upload: ['', [Validators.required]]
    });
   }

  ngOnInit() {
  }

  onPermuteFileSelected(event) {
    if (event.target.files.length > 0) {
      this.permuteFile = event.target.files[0];
    }
}

get uploadFormControl() { 
  return this.uploadForm.controls;
}

  onUpload() {
    if (this.permuteFile != undefined) {
        const fd = new FormData();
        fd.append('file', this.permuteFile);
        fd.append('caption', this.uploadForm.value.caption);
        this.authService.uploadFile(fd).subscribe((data) => {
          //enable in prod
          //this.regForm.reset();
          setTimeout(() => {
            this.router.navigateByUrl('user');
          }, 3000);
        }
      );
    }
  }

}
