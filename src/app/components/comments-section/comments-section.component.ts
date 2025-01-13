import { Component } from '@angular/core';

interface CommentData {
  name: string;
  text: string;
}

@Component({
  selector: 'app-comments-section',
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss'],
})
export class CommentsSectionComponent {
  comments: CommentData[] = [
    {
      name: 'Bob Fossil',
      text: `Oh I am so glad you taught me all about the big brown angry guys in the woods. With their sniffing little noses and their bad attitudes, they can sure be a menace — I was thinking of putting them all in a truck and driving them outta here. I run a zoo, you know.`,
    },
  ];

  showComments = false;
  nameInput = '';
  commentInput = '';
  errorMessage = ''; // To display error messages
  errorVisible = false; // To control error message visibility

  toggleComments(): void {
    this.showComments = !this.showComments;
    this.errorMessage = '';
    this.errorVisible = false;
  }

  onSubmit(): void {
    if (!this.nameInput.trim() || !this.commentInput.trim()) {
      this.displayError('Both name and comment are required.');
      return;
    }

    // Announce successful submission using speech synthesis
    const successSpeech = new SpeechSynthesisUtterance(
      'Comment submitted successfully!'
    );
    window.speechSynthesis.speak(successSpeech);

    this.comments.push({
      name: this.nameInput.trim(),
      text: this.commentInput.trim(),
    });

    // Reset form inputs and error message
    this.nameInput = '';
    this.commentInput = '';
    this.errorMessage = '';
    this.errorVisible = false;
  }

  private displayError(message: string): void {
    this.errorMessage = '';
    this.errorVisible = true;

    // Briefly clear and reset the error message for screen readers
    setTimeout(() => {
      this.errorMessage = message;
    }, 10);
  }
}
