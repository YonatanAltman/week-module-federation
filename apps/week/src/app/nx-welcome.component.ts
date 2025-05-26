import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Welcome to Nx Angular Module Federation</h1>
      
      <section class="concept-section">
        <h2>What is Module Federation?</h2>
        <p>
          Module Federation is a powerful feature that allows you to dynamically load code from other applications at runtime.
          It enables micro-frontend architecture, where multiple applications can share code and functionality seamlessly.
        </p>
      </section>

      <section class="benefits-section">
        <h2>Key Benefits</h2>
        <ul>
          <li>
            <strong>Independent Deployment:</strong>
            <p>Deploy micro-frontends independently without affecting other parts of the application</p>
          </li>
          <li>
            <strong>Code Sharing:</strong>
            <p>Share components, services, and utilities across multiple applications</p>
          </li>
          <li>
            <strong>Runtime Integration:</strong>
            <p>Load remote modules dynamically at runtime without rebuilding the entire application</p>
          </li>
          <li>
            <strong>Team Autonomy:</strong>
            <p>Different teams can work on different micro-frontends independently</p>
          </li>
        </ul>
      </section>

      <section class="architecture-section">
        <h2>Architecture Overview</h2>
        <div class="architecture-diagram">
          <div class="host">
            <h3>Host Application</h3>
            <p>Main application that loads remote modules</p>
          </div>
          <div class="remote">
            <h3>Remote Applications</h3>
            <p>Independent applications exposing modules</p>
          </div>
        </div>
      </section>

      <section class="getting-started">
        <h2>Getting Started</h2>
        <ol>
          <li>Configure your host application to consume remote modules</li>
          <li>Set up remote applications to expose their modules</li>
          <li>Define shared dependencies</li>
          <li>Implement dynamic loading of remote modules</li>
        </ol>
      </section>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }

    h2 {
      color: #3498db;
      margin: 2rem 0 1rem;
      font-size: 1.8rem;
    }

    section {
      margin-bottom: 3rem;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    ul, ol {
      padding-left: 1.5rem;
    }

    li {
      margin-bottom: 1rem;
    }

    .benefits-section li {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    .benefits-section strong {
      color: #2c3e50;
      display: block;
      margin-bottom: 0.5rem;
    }

    .architecture-diagram {
      display: flex;
      gap: 2rem;
      margin-top: 1rem;
    }

    .host, .remote {
      flex: 1;
      background: white;
      padding: 1.5rem;
      border-radius: 6px;
      text-align: center;
    }

    .host h3, .remote h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }

    p {
      line-height: 1.6;
      color: #4a5568;
    }

    .getting-started ol {
      background: white;
      padding: 1.5rem;
      border-radius: 6px;
    }

    .getting-started li {
      margin-bottom: 0.5rem;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class NxWelcomeComponent {}
