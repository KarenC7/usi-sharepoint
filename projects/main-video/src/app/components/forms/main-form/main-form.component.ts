import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { FormsService,SharepointIntegrationService } from 'shared-lib';
import { environment } from '../../../../environments/environment';
import { MainTableService } from '../../../services/main-table.service';


@Component({
  selector: 'mv-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss']
})
export class MainFormComponent implements OnInit {

  typeSelect: string = "none";

  imageSelect: string = "none";


  @Input() data: any;
  flags = {
    loadingFields: true
  };
  private isNew: boolean;
  mainForm: FormGroup;

  mainCheck: boolean = false;

  constructor(
    private fb: FormBuilder,
    private fs: FormsService,
    private mts: MainTableService,
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.isNew = this.data ? false : true;

    this.setupForm();

    this.mainForm.get('type').valueChanges.subscribe(value => {
      if (value) {
        this.urlVideoCtrl.clearValidators();
        this.idVideoCtrl.clearValidators();



        if (value === 'enlace') {
          this.mainForm.patchValue({
            idVideo: null,

          });

          this.typeSelect="enlace";
          this.urlVideoCtrl.setValidators([
            Validators.required,
            Validators.pattern(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/)
          ]);
        } else if (value === 'idvideo') {
          this.mainForm.patchValue({
            urlVideo: null,

          });

          this.typeSelect=null;
          this.idVideoCtrl.setValidators([Validators.required]);
        }

        this.urlVideoCtrl.updateValueAndValidity();
        this.idVideoCtrl.updateValueAndValidity();
      }
    });


    this.mainForm.get('imagetype').valueChanges.subscribe(value => {
      if (value) {
       // this.urlVideoCtrl.clearValidators();
       // this.idVideoCtrl.clearValidators();



        if (value === 'imagenvideo') {
          this.mainForm.patchValue({
            image: null,
          });

          this.imageSelect="imagenvideo";

        } else if (value === 'imagennueva') {

          this.imageSelect=null;
           this.imageCtrl.setValidators([
            Validators.required,
           ]);
        }

        this.urlVideoCtrl.updateValueAndValidity();
        this.idVideoCtrl.updateValueAndValidity();
      }
    });



  }

  // Custom public methods

  disableFields() {
    this.fs.disableFields(this.mainForm);
  }

  enableFields() {
    this.fs.enableFields(this.mainForm);
  }

  submit() {
    const values = this.mainForm.value;

    console.log(values);

    const data: any = {
      __metadata: environment.sharepoint.metadata,
      Title: values.title,
      Idvideo: values.idVideo,
      EnlaceVideo: values.urlVideo,
      Imagen: values.image ? values.image.data : null,
      NombreImagen: values.image ? values.image.name : null,
      MostrarF: this.imageSelect,
      TipoVideo: this.typeSelect,
      Orden: Number(values.setVideo),

    };

    if (values.id) {
      data.Id = values.id;
    }

    this.validateOrder(Number(values.setVideo), values.id);
    return this.sis.getFormDigest().pipe(
      switchMap(formDigest => {
        return this.sis.save(environment.sharepoint.listName, data, formDigest);
      })
    );
  }

  // Custom private methods

  private setupForm() {
    this.mainForm = this.fb.group({

      id: null,
      idVideo: null,
      image: null,
      setVideo: null,
      title: [null, Validators.required],
      type: [null, Validators.required],
      imagetype: [null, Validators.required],
      urlVideo: null
    });

    if (!this.isNew) {
       console.log(this.data);
      this.mainForm.patchValue({
        id: this.data.id,
        title: this.data.title,
        idVideo: this.data.idVideo,
        type: this.data.idVideo!=null ? this.typeSelect=null : this.typeSelect="enlace" ,
        image: {
          data: '',
          name: this.data.imageName,
          type: 'image/jpg'
        },
        imagetype: this.data.imageName!=null ? this.imageSelect=null : this.imageSelect="imagenvideo" ,
        imageSelect: this.data.showImage,
        setVideo: this.data.order,
        urlVideo: this.data.urlVideo,

      });
    }
  }


  //Getters and setters

  get idVideoCtrl(){
    return this.mainForm.get('idVideo');
  }
  get urlVideoCtrl(){
    return this.mainForm.get('urlVideo');
  }

  get imageCtrl(){
    return this.mainForm.get('image');
  }
  get showPictureCtrl(){
    return this.mainForm.get('showPicture');
  }

  get setVideoCtrl(){
    return this.mainForm.get('setVideo');
  }

  get type() {
    return this.mainForm.get('type');
  }


  validateOrder(ord, id){
      const data ={
        select: ['Id', 'Orden'],
        filter: [`Orden eq ${ord}`, `Id ne ${id}`],
        top: 1
      };

      this.sis.read(environment.sharepoint.listName, data).subscribe((response: any)=>
      {

        if (response.value.length>0) {

          const data: any ={
            __metadata: environment.sharepoint.metadata,
            Id: response.value[0].Id,
            Orden: null
          };

          this.sis.getFormDigest().pipe(
            switchMap(formDigest => {
              return this.sis.save(environment.sharepoint.listName, data, formDigest);
            })
          ).subscribe(()=>{
            this.validateOrder(data.Orden, data.Id);
            this.mts.loadData().subscribe();

          },);

        }
      });
  }

   updateMainController()
    {
      if(this.mainForm.value.main)
      {
        const data = {
          select: ['Id', 'Orden'],
          top: 5000
        };
        this.sis.read(environment.sharepoint.listName, data)
        .subscribe((response: any) => {
          for(var i=0; i<response.value.length;i++)
          {
            if(response.value[i].Orden==1)
            {
              if(this.mainForm.value.id != response.value[i].Id)
              {
                this.mainForm.get('setVideo').setValue(false);
                this.mainCheck = true;
              }
            }

          }
        });
      }
    }

}


