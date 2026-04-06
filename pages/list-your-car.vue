<!-- pages/list-your-car.vue -->
<template>
  <div class="page-wrap">
    <div class="container-brim py-12 max-w-3xl">
      <!-- Header -->
      <div class="mb-10">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-body font-500 mb-4"
          style="
            background: var(--color-brand-subtle);
            color: var(--color-brand);
          "
        >
          <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
          Free to list
        </div>
        <h1 class="font-display text-4xl text-ink leading-tight">
          List Your Car
        </h1>
        <p
          class="font-body text-base text-ink-muted mt-3 max-w-lg leading-relaxed"
        >
          Fill in the details below. BRIM reviews every listing before it goes
          live. You'll also get a
          <strong class="text-ink">Market Score</strong> — showing buyers
          whether your price is competitive.
        </p>
      </div>

      <!-- Auth gate -->
      <div v-if="!isAuthenticated" class="gate-card">
        <div class="gate-icon">
          <UIcon
            name="i-heroicons-lock-closed"
            class="w-6 h-6"
            style="color: var(--color-brand)"
          />
        </div>
        <h2 class="font-display text-xl text-ink mb-1">
          Sign in to list your car
        </h2>
        <p class="font-body text-sm text-ink-muted mb-6">
          Create a free account to submit your listing in minutes.
        </p>
        <div class="flex gap-3">
          <UButton to="/auth/login" variant="outline" class="font-body"
            >Sign In</UButton
          >
          <UButton
            to="/auth/register"
            class="font-body font-500"
            style="background: var(--color-brand); color: white"
            >Create Account</UButton
          >
        </div>
      </div>

      <!-- Form -->
      <form v-else class="form-body" @submit.prevent="submit">
        <!-- Step 1: Photos -->
        <div class="form-section">
          <div class="section-header">
            <span class="step-badge">1</span>
            <div>
              <h2 class="font-display text-xl text-ink">Photos</h2>
              <p class="font-body text-xs text-ink-muted mt-0.5">
                Upload up to 6 photos. First one becomes the cover.
              </p>
            </div>
          </div>
          <ImageUploader v-model="form.images" :max-images="6" />
        </div>

        <!-- Step 2: Car Details -->
        <div class="form-section">
          <div class="section-header">
            <span class="step-badge">2</span>
            <div>
              <h2 class="font-display text-xl text-ink">Car Details</h2>
              <p class="font-body text-xs text-ink-muted mt-0.5">
                Basic information about the vehicle.
              </p>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group">
              <label class="field-label">Make *</label>
              <USelect
                v-model="form.make"
                :items="makeOptions"
                placeholder="Select make"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Model *</label>
              <UInput
                v-model="form.model"
                placeholder="e.g. Fielder, Axio, Harrier"
                class="font-body"
                required
              />
            </div>
            <div class="field-group">
              <label class="field-label">Year *</label>
              <USelect
                v-model="form.year"
                :items="yearOptions"
                placeholder="Select year"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Colour</label>
              <UInput
                v-model="form.color"
                placeholder="e.g. Pearl White, Black"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Body Type</label>
              <USelect
                v-model="form.body_type"
                :items="bodyTypeOptions"
                placeholder="Select type"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Condition *</label>
              <USelect
                v-model="form.condition"
                :items="conditionOptions"
                class="font-body"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Engine & Transmission -->
        <div class="form-section">
          <div class="section-header">
            <span class="step-badge">3</span>
            <div>
              <h2 class="font-display text-xl text-ink">
                Engine & Transmission
              </h2>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group">
              <label class="field-label">Engine Size (Litres)</label>
              <UInput
                v-model="form.engine_size"
                type="number"
                step="0.1"
                placeholder="e.g. 1.5"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Mileage (km) *</label>
              <UInput
                v-model="form.mileage"
                type="number"
                placeholder="e.g. 65000"
                class="font-body"
                required
              />
            </div>
            <div class="field-group col-span-2">
              <label class="field-label">Transmission *</label>
              <div class="toggle-group">
                <button
                  v-for="t in transmissionOptions"
                  :key="t.value"
                  type="button"
                  class="toggle-btn"
                  :class="{ active: form.transmission === t.value }"
                  @click="form.transmission = t.value"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Fuel Type *</label>
              <USelect
                v-model="form.fuel_type"
                :items="fuelOptions"
                class="font-body"
              />
            </div>
            <div class="field-group">
              <label class="field-label">Drive Type</label>
              <USelect
                v-model="form.drive_type"
                :items="driveOptions"
                class="font-body"
              />
            </div>
          </div>
        </div>

        <!-- Step 4: Pricing -->
        <div class="form-section">
          <div class="section-header">
            <span class="step-badge">4</span>
            <div>
              <h2 class="font-display text-xl text-ink">Pricing</h2>
              <p class="font-body text-xs text-ink-muted mt-0.5">
                Enter your asking price and we'll show your Market Score
                instantly.
              </p>
            </div>
          </div>

          <div class="pricing-layout">
            <!-- Price input -->
            <div class="field-group">
              <label class="field-label">Asking Price (KES) *</label>
              <div class="price-input-wrap">
                <span class="price-prefix">KES</span>
                <input
                  v-model="form.price"
                  type="number"
                  placeholder="1200000"
                  required
                  class="price-input"
                />
              </div>
              <p
                v-if="marketRef"
                class="text-xs font-body text-ink-faint mt-1.5"
              >
                Market range for {{ form.make }} {{ form.model }}:
                <strong class="text-ink"
                  >KES {{ formatNum(marketRef.min) }} –
                  {{ formatNum(marketRef.max) }}</strong
                >
              </p>
              <p
                v-else-if="form.make && form.model"
                class="text-xs font-body text-ink-faint mt-1.5"
              >
                No reference data for this model yet.
              </p>
            </div>

            <!-- Live Market Score card -->
            <Transition name="score-pop">
              <div
                v-if="scorePreview && form.price"
                class="score-card"
                :class="scorePreview"
              >
                <div class="score-icon-wrap">
                  <UIcon :name="scoreIcon" class="w-6 h-6" />
                </div>
                <div>
                  <p
                    class="font-body text-xs uppercase tracking-wider font-500 opacity-70 mb-0.5"
                  >
                    Market Score
                  </p>
                  <p class="font-display text-xl">{{ scoreLabel }}</p>
                  <p class="font-body text-xs mt-1 opacity-75 leading-relaxed">
                    {{ scoreText }}
                  </p>
                </div>
              </div>
              <div
                v-else-if="!scorePreview && form.price && !marketRef"
                class="score-card neutral"
              >
                <div class="score-icon-wrap">
                  <UIcon
                    name="i-heroicons-question-mark-circle"
                    class="w-6 h-6"
                  />
                </div>
                <div>
                  <p
                    class="font-body text-xs uppercase tracking-wider font-500 opacity-70 mb-0.5"
                  >
                    Market Score
                  </p>
                  <p class="font-display text-xl">Not Available</p>
                  <p class="font-body text-xs mt-1 opacity-75">
                    Select make and model to see pricing intelligence.
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Step 5: Description -->
        <div class="form-section">
          <div class="section-header">
            <span class="step-badge">5</span>
            <div>
              <h2 class="font-display text-xl text-ink">Description & Title</h2>
            </div>
          </div>

          <div class="space-y-4">
            <div class="field-group">
              <label class="field-label">Listing Title *</label>
              <UInput
                v-model="form.title"
                placeholder="e.g. 2016 Toyota Fielder X — Low Mileage"
                class="font-body"
                required
              />
              <p class="text-xs font-body text-ink-faint mt-1">
                Make it descriptive — buyers search by title.
              </p>
            </div>
            <div class="field-group">
              <label class="field-label">Description</label>
              <textarea
                v-model="form.description"
                rows="5"
                placeholder="Service history, modifications, reason for selling, any extras included..."
                class="brim-textarea"
              />
            </div>
            <div class="field-group max-w-xs">
              <label class="field-label">Location</label>
              <UInput
                v-model="form.location"
                placeholder="e.g. Nairobi, Westlands"
                class="font-body"
              />
            </div>
          </div>
        </div>

        <!-- Error -->
        <UAlert
          v-if="submitError"
          color="error"
          variant="soft"
          :title="submitError"
          icon="i-heroicons-exclamation-triangle"
        />

        <!-- Submit -->
        <div class="submit-row">
          <UButton
            type="submit"
            :loading="submitting"
            size="lg"
            class="font-body font-500 px-10"
            style="background: var(--color-brand); color: white"
          >
            Submit for Review
          </UButton>
          <p class="font-body text-xs text-ink-faint">
            BRIM reviews all listings within 24 hours.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeo({
  title: "List Your Car",
  description:
    "Sell your car on BRIM Automotive. Get a Market Score to see if your price is competitive.",
});

const { isAuthenticated, authFetch } = useAuth();
const router = useRouter();
const submitting = ref(false);
const submitError = ref("");
const scorePreview = ref<string | null>(null);

const form = reactive({
  title: "",
  make: undefined as string | undefined,
  model: "",
  year: undefined as string | undefined,
  price: "",
  mileage: "",
  engine_size: "",
  transmission: "automatic" as "automatic" | "manual",
  fuel_type: "petrol",
  drive_type: "2WD",
  color: "",
  body_type: undefined as string | undefined,
  condition: "foreign used",
  description: "",
  location: "Nairobi",
  images: [] as { url: string; is_primary: boolean }[],
});

const formatNum = (n: number) => new Intl.NumberFormat("en-KE").format(n);
const marketRef = computed(() => {
  const key = `${form.make}_${form.model}`;
  return marketRanges[key] ?? null;
});

const marketRanges: Record<string, { min: number; max: number }> = {
  Toyota_Fielder: { min: 1050000, max: 1350000 },
  Toyota_Axio: { min: 850000, max: 1150000 },
  Toyota_Premio: { min: 900000, max: 1200000 },
  Toyota_Harrier: { min: 2800000, max: 3800000 },
  "Toyota_Land Cruiser Prado": { min: 4500000, max: 6500000 },
  Mazda_Demio: { min: 650000, max: 950000 },
  Subaru_Forester: { min: 1500000, max: 2000000 },
  Honda_Fit: { min: 700000, max: 950000 },
  Nissan_Note: { min: 700000, max: 950000 },
  "Mercedes-Benz_C200": { min: 3500000, max: 5000000 },
};

watch([() => form.make, () => form.model, () => form.price], () => {
  const key = `${form.make}_${form.model}`;
  const price = parseInt(form.price);
  const ref = marketRanges[key];
  if (!ref || !price) {
    scorePreview.value = null;
    return;
  }
  if (price < ref.min) scorePreview.value = "good_deal";
  else if (price > ref.max) scorePreview.value = "overpriced";
  else scorePreview.value = "fair_price";
});

const scoreIcon = computed(
  () =>
    ({
      good_deal: "i-heroicons-arrow-trending-down",
      fair_price: "i-heroicons-check-circle",
      overpriced: "i-heroicons-arrow-trending-up",
    })[scorePreview.value ?? ""] ?? "",
);

const scoreLabel = computed(
  () =>
    ({
      good_deal: "Good Deal",
      fair_price: "Fair Price",
      overpriced: "Overpriced",
    })[scorePreview.value ?? ""] ?? "",
);

const scoreText = computed(
  () =>
    ({
      good_deal: "Your price is below market rate — buyers will love this.",
      fair_price: "Your price is within the expected market range.",
      overpriced:
        "Your price is above market rate — consider adjusting to attract more buyers.",
    })[scorePreview.value ?? ""] ?? "",
);

const submit = async () => {
  submitting.value = true;
  submitError.value = "";
  try {
    const res = await authFetch<any>("/api/listings", {
      method: "POST",
      body: {
        ...form,
        year: parseInt(form.year ?? "0"),
        price: parseInt(form.price),
        mileage: parseInt(form.mileage),
        engine_size: form.engine_size ? parseFloat(form.engine_size) : null,
      },
    });
    const listingId = res.data?.id;
    if (!listingId) throw new Error("Unexpected response");
    for (const img of form.images) {
      await authFetch(`/api/listings/${listingId}/images`, {
        method: "POST",
        body: { url: img.url, is_primary: img.is_primary },
      });
    }
    await router.push("/dashboard/listings?submitted=1");
  } catch (e: any) {
    submitError.value =
      e?.data?.message ?? "Failed to submit. Please try again.";
  } finally {
    submitting.value = false;
  }
};

const currentYear = new Date().getFullYear();
const makeOptions = [
  "Toyota",
  "Mazda",
  "Subaru",
  "Honda",
  "Nissan",
  "Mercedes-Benz",
  "BMW",
  "Volkswagen",
  "Mitsubishi",
  "Isuzu",
  "Other",
].map((m) => ({ label: m, value: m }));
const yearOptions = Array.from({ length: currentYear - 2004 }, (_, i) => {
  const y = currentYear - i;
  return { label: String(y), value: String(y) };
});
const bodyTypeOptions = [
  "Sedan",
  "Station Wagon",
  "SUV",
  "Hatchback",
  "Pickup",
  "Coupe",
  "Van",
  "Minivan",
].map((b) => ({ label: b, value: b }));
const conditionOptions = [
  { label: "Foreign Used", value: "foreign used" },
  { label: "Locally Used", value: "locally used" },
  { label: "Brand New", value: "new" },
];
const transmissionOptions = [
  { label: "Automatic", value: "automatic" },
  { label: "Manual", value: "manual" },
];
const fuelOptions = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Electric", value: "electric" },
];
const driveOptions = [
  { label: "2WD", value: "2WD" },
  { label: "4WD", value: "4WD" },
  { label: "AWD", value: "AWD" },
];
</script>

<style scoped>
.page-wrap {
  background: var(--color-surface-2);
  min-height: 100vh;
}

.gate-card {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-3);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: var(--shadow-card);
}
.gate-icon {
  width: 48px;
  height: 48px;
  background: var(--color-brand-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-3);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-surface-3);
}

.step-badge {
  width: 28px;
  height: 28px;
  background: var(--color-brand);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .fields-grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
}

.col-span-2 {
  grid-column: span 2;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toggle-group {
  display: flex;
  gap: 0.5rem;
}
.toggle-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  border: 1.5px solid var(--color-surface-3);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink-soft);
  background: var(--color-surface-2);
  cursor: pointer;
  transition: all 0.15s ease;
}
.toggle-btn:hover {
  border-color: var(--color-ink-faint);
}
.toggle-btn.active {
  border-color: var(--color-brand);
  background: var(--color-brand-subtle);
  color: var(--color-brand);
  font-weight: 500;
}

.price-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--color-surface-3);
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-surface);
  transition: border-color 0.15s;
}
.price-input-wrap:focus-within {
  border-color: var(--color-brand);
}
.price-prefix {
  padding: 0 0.875rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-ink-faint);
  background: var(--color-surface-2);
  border-right: 1px solid var(--color-surface-3);
  height: 40px;
  display: flex;
  align-items: center;
}
.price-input {
  flex: 1;
  padding: 0 0.875rem;
  height: 40px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink);
  background: transparent;
  border: none;
  outline: none;
}
.price-input::placeholder {
  color: var(--color-ink-faint);
}

.score-preview {
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  border: 1.5px solid;
}
.score-preview.good_deal {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}
.score-preview.fair_price {
  border-color: #fcd34d;
  background: #fffbeb;
  color: #92400e;
}
.score-preview.overpriced {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #991b1b;
}

.brim-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--color-ink);
  background: var(--color-surface);
  border: 1.5px solid var(--color-surface-3);
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.15s;
  line-height: 1.6;
}
.brim-textarea:focus {
  border-color: var(--color-brand);
}
.brim-textarea::placeholder {
  color: var(--color-ink-faint);
}

.submit-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Pricing layout */
.pricing-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 640px) {
  .pricing-layout {
    grid-template-columns: 1fr;
  }
}

/* Score card */
.score-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1.5px solid;
}
.score-card.good_deal {
  border-color: #86efac;
  background: #f0fdf4;
  color: #166534;
}
.score-card.fair_price {
  border-color: #fcd34d;
  background: #fffbeb;
  color: #92400e;
}
.score-card.overpriced {
  border-color: #fca5a5;
  background: #fef2f2;
  color: #991b1b;
}
.score-card.neutral {
  border-color: var(--color-surface-3);
  background: var(--color-surface-2);
  color: var(--color-ink-muted);
}

.score-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Score pop animation */
.score-pop-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.score-pop-leave-active {
  transition: all 0.15s ease;
}
.score-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(4px);
}
.score-pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
