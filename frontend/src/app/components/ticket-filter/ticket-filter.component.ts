import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { Category } from 'src/app/models/category.interface';

@Component({
  standalone: false,

  selector: 'app-ticket-filter',
  templateUrl: './ticket-filter.component.html',
  styleUrls: ['./ticket-filter.component.css']
})
export class TicketFilterComponent implements OnInit {
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceRangeChange = new EventEmitter<{min: number | null, max: number | null}>();
  @Output() resetFiltersEvent = new EventEmitter<void>();

  categories: Category[] = [];
  selectedCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.ticketService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory);
  }

  onPriceRangeChange(): void {
    this.priceRangeChange.emit({
      min: this.minPrice,
      max: this.maxPrice
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.resetFiltersEvent.emit();
  }
}