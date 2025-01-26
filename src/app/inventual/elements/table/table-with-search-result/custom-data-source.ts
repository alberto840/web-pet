import { DataSource } from '@angular/cdk/table';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserInterfaceData } from 'src/app/inventual/data/userData';

export class CustomDataSource extends MatTableDataSource<UserInterfaceData> {
    constructor(initialData: UserInterfaceData[]) {
      super(initialData);
    }
  }
