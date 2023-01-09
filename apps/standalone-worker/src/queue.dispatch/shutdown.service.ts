import { Subject } from 'rxjs';

export class ShutdownService {
  // Create an rxjs Subject that your application can subscribe to
  private shutdownListener$: Subject<void> = new Subject();

  // Subscribe to the shutdown in your main.ts
  subscribeToShutdown(shutdownFn: () => void): void {
    this.shutdownListener$.subscribe(() => shutdownFn());
  }

  // Emit the shutdown event
  shutdown() {
    this.shutdownListener$.next();
  }
}
