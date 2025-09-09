import { Component, OnInit } from '@angular/core';
import { PoetryService } from './services/poetry.service';
import { Poem } from './models/poem.model';
import { PoetryApiError } from './utils/api-error';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [PoetryService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PoetryDB Angular App';
  poems: Poem[] = [];
  loading = false;
  error: string | null = null;
  
  // Form inputs
  authorInput = '';
  titleInput = '';

  constructor(private poetryService: PoetryService) {}

  ngOnInit() {
    this.demonstrateApiCalls();
  }

  /**
   * Demonstrate various API calls with error handling
   */
  private demonstrateApiCalls() {
    console.log('Starting PoetryDB API demonstration...');
    
    // Test with Shakespeare
    this.poetryService.getPoemsByAuthorAndTitle('Shakespeare', 'Sonnet 33')
      .subscribe({
        next: poems => {
          console.log('Poems by Shakespeare: ', poems);
          this.poems = poems;
        },
        error: err => {
          console.error('Error fetching Sharespeare poems')
        }
      });
    
  }


  /**
   * Handle form submission
   */
  onSubmit() {
    const author = this.authorInput.trim();
    const title = this.titleInput.trim();

    if (author && title) {
      this.poetryService.getPoemsByAuthorAndTitle(author, title)
        .subscribe({
          next: poems => this.poems = poems,
          error: err => this.error = err.message
        });
    } else if (!title) {
      this.poetryService.getPoemsByAuthor(author)
        .subscribe({
          next: poems => this.poems = poems,
          error: err => this.error = err.message
        });;
    } else {
      this.poetryService.getPoemsByTitle(title)
        .subscribe({
          next: poems => this.poems = poems,
          error: err => this.error = err.message
        });;
    }
  }

  /**
   * Test error handling with invalid data
   */
  testErrorHandling() {
    console.log('🧪 Testing error handling with invalid author...');
    this.poetryService.getPoemsByAuthor('NonExistentAuthor12345');
  }
}