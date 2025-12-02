import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { User } from '../../../../core/models/user.model';
import { UsersAdminService } from '../../services/users-admin.service';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-admin-page',
  templateUrl: './users-admin-page.component.html',
  styleUrls: ['./users-admin-page.component.scss']
})
export class UsersAdminPageComponent implements OnInit, OnDestroy {
  @ViewChild('userTable') userTable: any;

  users: User[] = [];
  selectedUsers: User[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  
  searchTerm: string = '';
  selectedRole: string = '';
  isLoading: boolean = false;
  
  stats: any = {};
  
  private destroy$ = new Subject<void>();

  constructor(
    private usersAdminService: UsersAdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadUserStats();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar usuarios
  loadUsers() {
    this.isLoading = true;
    
    this.usersAdminService
      .getUsers(this.currentPage, this.pageSize, this.searchTerm, this.selectedRole)
      .pipe(
        finalize(() => this.isLoading = false),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.users = response.data;
          this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.showError('Error al cargar usuarios');
        }
      });
  }

  // Cargar estadísticas
  loadUserStats() {
    this.usersAdminService.getUserStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
        }
      });
  }

  // Cambiar página
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  // Filtrar usuarios
  onSearch() {
    this.currentPage = 1;
    this.loadUsers();
  }

  // Limpiar filtros
  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  // Crear nuevo usuario
  createNewUser() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.loadUserStats();
        this.showSuccess('Usuario creado exitosamente');
      }
    });
  }

  // Editar usuario
  onEditUser(user: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { mode: 'edit', user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.showSuccess('Usuario actualizado exitosamente');
      }
    });
  }

  // Eliminar usuario
  onDeleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar al usuario ${user.fullName}? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usersAdminService.deleteUser(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadUsers();
              this.loadUserStats();
              this.showSuccess('Usuario eliminado exitosamente');
            },
            error: (error) => {
              console.error('Error deleting user:', error);
              this.showError('Error al eliminar usuario');
            }
          });
      }
    });
  }

  // Cambiar estado de usuario
  onToggleStatus(event: { user: User, active: boolean }) {
    this.usersAdminService.toggleUserStatus(event.user.id, event.active)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
          this.showSuccess(`Usuario ${event.active ? 'activado' : 'desactivado'} exitosamente`);
        },
        error: (error) => {
          console.error('Error toggling user status:', error);
          this.showError('Error al cambiar estado del usuario');
        }
      });
  }

  // Cambiar rol de usuario
  onChangeRole(event: { user: User, role: string }) {
    this.usersAdminService.changeUserRole(event.user.id, event.role)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
          this.showSuccess(`Rol cambiado a ${event.role} exitosamente`);
        },
        error: (error) => {
          console.error('Error changing user role:', error);
          this.showError('Error al cambiar rol del usuario');
        }
      });
  }

  // Selección de usuarios
  onSelectionChange(users: User[]) {
    this.selectedUsers = users;
  }

  // Eliminación masiva
  bulkDelete() {
    if (this.selectedUsers.length === 0) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación masiva',
        message: `¿Estás seguro de eliminar ${this.selectedUsers.length} usuario(s) seleccionado(s)?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const deletePromises = this.selectedUsers.map(user => 
          this.usersAdminService.deleteUser(user.id).toPromise()
        );

        Promise.all(deletePromises)
          .then(() => {
            this.loadUsers();
            this.loadUserStats();
            this.selectedUsers = [];
            this.showSuccess(`${this.selectedUsers.length} usuario(s) eliminado(s) exitosamente`);
          })
          .catch(error => {
            console.error('Error in bulk delete:', error);
            this.showError('Error en eliminación masiva');
          });
      }
    });
  }

  // Activar/Desactivar masivo
  bulkToggleStatus(active: boolean) {
    if (this.selectedUsers.length === 0) return;

    const togglePromises = this.selectedUsers.map(user => 
      this.usersAdminService.toggleUserStatus(user.id, active).toPromise()
    );

    Promise.all(togglePromises)
      .then(() => {
        this.loadUsers();
        this.selectedUsers = [];
        this.showSuccess(`${this.selectedUsers.length} usuario(s) ${active ? 'activado(s)' : 'desactivado(s)'} exitosamente`);
      })
      .catch(error => {
        console.error('Error in bulk toggle:', error);
        this.showError('Error al cambiar estado masivo');
      });
  }

  // Exportar a CSV
  exportToCSV() {
    // Implementar exportación a CSV
    this.showInfo('Exportación a CSV en desarrollo');
  }

  // Mostrar notificaciones
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showInfo(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
  }
}
