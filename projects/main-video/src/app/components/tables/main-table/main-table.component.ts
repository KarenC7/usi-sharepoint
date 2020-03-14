import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { switchMap } from 'rxjs/operators';
import { MessageService, SharepointIntegrationService } from 'shared-lib';
import { MainFormDialogComponent } from '../../dialogs/main-form-dialog/main-form-dialog.component';
import { MainTableDataSource } from '../../../datasources/main-table.datasource';
import { MainTableService } from '../../../services/main-table.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'mv-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.scss']
})
export class MainTableComponent implements OnInit {

  columns = COLUMNS;
  displayedColumns = ['id', 'title', 'createdLabel', 'idVideo' , 'urlVideo' , 'imageName', 'order', 'operations'];
  dataSource: MainTableDataSource;
  loading = true;

  constructor(
    private dialog: MatDialog,
    private message: MessageService,
    private mts: MainTableService,
    private sis: SharepointIntegrationService
  ) {}

  ngOnInit() {
    this.dataSource = this.mts.dataSource;
    this.mts.loadData()
      .subscribe(
        () => {},
        err => this.message.genericHttpError(err),
        () => this.loading = false
      );
  }

  // Custom public methods

  onOperation(event) {
    switch (event.operation) {
      case 'delete':
        this.onDelete(event.item);
        break;
      case 'edit':
        this.onEdit(event.item);
        break;
    }
  }

  // Custom private methods

  private onDelete(item: any) {
    this.message.confirm({
      text: '¿Desea eliminar?',
      title: 'Eliminar'
    })
    .subscribe(response => {
      if (response) {
        this.sis.getFormDigest().pipe(
          switchMap(formDigest =>
            this.sis.delete(environment.sharepoint.listName, item.id, formDigest)
          )
        )
        .subscribe(
          () => {
            this.message.show('Elemento eliminado');
            this.mts.loadData().subscribe();
          },
          err => this.message.genericHttpError(err)
        );
      }
    });
  }

  private onEdit(item: any) {
    const dialogRef = this.dialog.open(MainFormDialogComponent, {
      data: item,
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.message.genericSaveMessage();
        }
      });
  }
}



export const COLUMNS = [
  {
    key: 'createdLabel',
    label: 'Creado'
  },

  {
    key: 'id',
    label: 'ID'
  },

  {
    key: 'title',
    label: 'Título'
  },
  {
    key: 'idVideo',
    label: 'Id Youtube'
  },
  {
    key: 'urlVideo',
    label: 'Enlace video'
  },

  {
    key: 'imageName',
    label: 'Imagen'
  },
  {
    key: 'order',
    label: 'Video Principal'
  }
];
