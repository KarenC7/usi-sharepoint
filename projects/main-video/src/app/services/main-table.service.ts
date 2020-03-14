import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import { SharepointIntegrationService } from 'shared-lib';
import { MainTableDataSource } from '../datasources/main-table.datasource';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MainTableService {

  dataSource: MainTableDataSource;
  constructor(
    private sis: SharepointIntegrationService
  ) {
    this.dataSource = new MainTableDataSource();
  }

  clearAll() {
    this.dataSource.clearAll();
  }

  loadData() {
    const data = {
      select: ['Id', 'Title', 'Created', 'Idvideo', 'EnlaceVideo', 'NombreImagen', 'Orden'],
      top: 5000
    };
    const datePipe = new DatePipe('en-US');

    return this.sis.read(environment.sharepoint.listName, data)
      .pipe(
        map((response: any) => {
          return response.value.map(r => {
            const item: any = {
              created: new Date(r.Created),
              id: r.Id,
              idVideo: r.Idvideo,
              imageData: r.Image,
              imageName: r.NombreImagen,
              urlVideo: r.EnlaceVideo,
              order: r.Orden,
              showImage: r.MostrarF,
              newsDate: new Date(r.Fechanoticia),
              summary: r.Descripcion,
              title: r.Title
            };

            item.createdLabel = datePipe.transform(item.created, 'yyyy-MM-dd hh:mm a');

            return item;
          });
        }),
        tap((response: any) => {
          this.dataSource.replaceAll(response);
        })
      );
  }


}
