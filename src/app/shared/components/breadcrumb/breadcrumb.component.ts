import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator: string = 'chevron_right';
  @Input() showHome: boolean = true;
  @Input() homeIcon: string = 'home';
  @Input() homeLabel: string = 'Inicio';
  @Input() homeUrl: string = '/';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.showHome) {
      this.items.unshift({
        label: this.homeLabel,
        url: this.homeUrl,
        icon: this.homeIcon
      });
    }
  }

  navigateTo(url?: string): void {
    if (url) {
      this.router.navigate([url]);
    }
  }

  isLastItem(index: number): boolean {
    return index === this.items.length - 1;
  }

  getItemClass(item: BreadcrumbItem, index: number): string {
    const classes = ['breadcrumb-item'];
    
    if (this.isLastItem(index)) {
      classes.push('active');
    }
    
    if (item.icon) {
      classes.push('has-icon');
    }
    
    return classes.join(' ');
  }
}
