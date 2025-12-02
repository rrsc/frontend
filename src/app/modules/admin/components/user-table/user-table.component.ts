import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
  @Input() users: User[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() toggleStatus = new EventEmitter<{user: User, active: boolean}>();
  @Output() changeRole = new EventEmitter<{user: User, role: string}>();
  @Output() selectionChange = new EventEmitter<User[]>();

  displayedColumns: string[] = [
    'select',
    'id',
    'avatar',
    'fullName',
    'email',
    'role',
    'status',
    'createdAt',
    'actions'
  ];

  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  roles = ['USER', 'ADMIN', 'MODERATOR'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.data = this.users;
  }

  ngOnChanges() {
    this.dataSource.data = this.users;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filtro para la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Selección de filas
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.emitSelection();
  }

  toggleRow(row: User) {
    this.selection.toggle(row);
    this.emitSelection();
  }

  emitSelection() {
    this.selectionChange.emit(this.selection.selected);
  }

  // Navegación de páginas
  onPageChange(event: any) {
    this.pageChange.emit(event.pageIndex + 1);
  }

  // Acciones
  onEdit(user: User) {
    this.editUser.emit(user);
  }

  onDelete(user: User) {
    this.deleteUser.emit(user);
  }

  onToggleStatus(user: User) {
    this.toggleStatus.emit({ user, active: !user.active });
  }

  onChangeRole(user: User, role: string) {
    this.changeRole.emit({ user, role });
  }

  // Utilidades
  getRoleColor(role: string): string {
    switch(role) {
      case 'ADMIN': return 'primary';
      case 'MODERATOR': return 'accent';
      default: return '';
    }
  }

  getStatusText(active: boolean): string {
    return active ? 'Activo' : 'Inactivo';
  }

  getStatusColor(active: boolean): string {
    return active ? 'success' : 'warn';
  }
}
