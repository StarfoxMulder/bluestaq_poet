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
    // Demonstrate API calls on component initialization
    this.demonstrateApiCalls();
  }

  /**
   * Demonstrate various API calls with error handling
   */
  private demonstrateApiCalls() {
    console.log('🚀 Starting PoetryDB API demonstration...');
    
    // Test with Shakespeare
    this.poetryService.getPoemsByAuthor('Shakespeare');
    
    // Test with poem Title
    setTimeout(() => {
      this.poetryService.getPoemsByTitle('We should not mind so small a flower');
    }, 2000);
  }

  /**
   * Search for specific poem
   */
//   searchSpecificPoem(author: string, title: string) {
//     console.log(`🔍 Searching for specific poem: "${title}" by ${author}`);
    
//     this.poetryService.getPoemByAuthorAndTitle(author, title).subscribe({
//       next: (poems) => {
//         console.log('✅ Specific poem search completed');
//       },
//       error: (error: PoetryApiError) => {
//         console.error('🚨 Specific poem search failed:', error);
//       }
//     });
//   }

  /**
   * Handle form submission
   */
  onSearch() {
    if (!this.authorInput.trim()) {
      this.error = 'Please enter an author name';
      return;
    }

    const title = this.titleInput.trim() || undefined;
    console.log(this.authorInput);
    this.poetryService.getPoemsByAuthor(this.authorInput.trim());
  }

  /**
   * Test error handling with invalid data
   */
  testErrorHandling() {
    console.log('🧪 Testing error handling with invalid author...');
    this.poetryService.getPoemsByAuthor('NonExistentAuthor12345');
  }
}