import { ChangeDetectionStrategy, Component, computed, linkedSignal, signal } from '@angular/core';

interface ShippingOption {
  id: string;
  label: string;
  cost: number;
}

const SHIPPING_BY_COUNTRY: Record<'USA' | 'Canada', ShippingOption[]> = {
  USA: [
    { id: 'standard', label: 'Standard Ground (5 days)', cost: 5 },
    { id: 'express', label: 'Next-Day Air', cost: 25 },
  ],
  Canada: [
    { id: 'intl-economy', label: 'Cross-Border Economy (7 days)', cost: 15 },
    { id: 'intl-priority', label: 'International Priority', cost: 40 },
  ],
};





@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="font-family: system-ui, sans-serif; max-width: 540px; margin: 2rem auto; padding: 1.5rem; border: 1px solid #ccc; border-radius: 8px;">
      <h2 style="margin-top: 0;">Checkout Shipping Demo</h2>

      <!-- 1. SOURCE OF TRUTH (signal) -->
      <section style="margin-bottom: 1.25rem; padding: 0.75rem; background: #f4f6f8; border-radius: 6px;">
        <strong>1. Source of Truth: <code>signal()</code></strong>
        <p style="margin: 0.5rem 0;">Selected Country: <strong>{{ country() }}</strong></p>
        <button (click)="country.set('USA')" [disabled]="country() === 'USA'">Switch to USA</button>
        <button (click)="country.set('Canada')" [disabled]="country() === 'Canada'" style="margin-left: 0.5rem;">
          Switch to Canada
        </button>
      </section>

      <!-- 2. READ-ONLY REPLICA (computed) -->
      <section style="margin-bottom: 1.25rem; padding: 0.75rem; background: #eef6ff; border-radius: 6px;">
        <strong>2. Read-Only Replica: <code>computed()</code></strong>
        <p style="margin: 0.5rem 0;">
          Available Options ({{ availableOptions().length }}):
          {{ availableOptions()[0].label }}, {{ availableOptions()[1].label }}
        </p>
        <small style="color: #555;">Locked to country(). Cannot be edited directly.</small>
      </section>

      <!-- 3. RESETTABLE LOCAL COPY (linkedSignal) -->
      <section style="padding: 0.75rem; background: #fff8e6; border-radius: 6px;">
        <strong>3. Resettable Copy: <code>linkedSignal()</code></strong>
        <p style="margin: 0.5rem 0;">
          Active Method: <strong>{{ selectedOption().label }}</strong> (\${{ selectedOption().cost }})
        </p>

        @for (option of availableOptions(); track option.id) {
          <button
            (click)="selectedOption.set(option)"
            [style.font-weight]="selectedOption().id === option.id ? 'bold' : 'normal'"
            style="margin-right: 0.5rem; margin-bottom: 0.25rem;"
          >
            Select {{ option.label }}
          </button>
        }
        <p style="margin: 0.5rem 0 0; font-size: 0.85rem; color: #664d03;">
          <em>Click the second option, then switch countries above. Notice how it resets!</em>
        </p>
      </section>
    </div>
  `,
})


export class App {
  // 1. SIGNAL: SOURCE OF TRUTH: Writable canonical state
  readonly country = signal<'USA' | 'Canada'>('USA');

  // 2. COMPUTED: Strictly derived, read-only replica
  readonly availableOptions = computed(() => SHIPPING_BY_COUNTRY[this.country()]);

  // 3. LINKED SIGNAL: Writable local copy that falls back to the first available option
  // whenever `availableOptions()` (which means `country()`) changes.
  readonly selectedOption = linkedSignal(() => this.availableOptions()[0]);
}

// Export alias
export { App as AppComponent };
