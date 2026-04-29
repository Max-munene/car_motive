<!-- pages/auth/register.vue -->
<template>
  <div class="w-full max-w-sm">
    <div class="bg-surface rounded-xl border border-surface-3 shadow-card p-8">
      <div class="text-center mb-7">
        <BrimLogo class="justify-center mb-4" />
        <h1 class="font-display text-2xl text-ink">Create Account</h1>
        <p class="font-body text-sm text-ink-muted mt-1">
          Start buying or selling cars
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Full Name</label
          >
          <UInput
            v-model="fullName"
            placeholder="John Kamau"
            autocomplete="name"
            class="font-body"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Email</label
          >
          <UInput
            v-model="email"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
            class="font-body"
            required
          />
        </div>
        <div>
          <label class="block text-xs font-body font-500 text-ink-muted mb-1.5"
            >Password</label
          >
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Minimum 8 characters"
            autocomplete="new-password"
            class="font-body"
            required
            minlength="8"
          >
            <template #trailing>
              <button type="button" @click="showPassword = !showPassword">
                <UIcon
                  :name="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  class="w-4 h-4 text-ink-faint hover:text-ink-soft"
                />
              </button>
            </template>
          </UInput>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          icon="i-heroicons-exclamation-circle"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          class="font-body font-400 mt-2"
          style="background-color: var(--color-brand); color: white"
        >
          Create Account
        </UButton>
      </form>

      <p
        class="text-center text-xs font-body text-ink-faint mt-4 leading-relaxed"
      >
        By creating an account you agree to our
        <NuxtLink to="/terms" class="text-brand hover:underline"
          >Terms</NuxtLink
        >
        and
        <NuxtLink to="/privacy" class="text-brand hover:underline"
          >Privacy Policy</NuxtLink
        >.
      </p>

      <p class="text-center text-sm font-body text-ink-muted mt-5">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-brand hover:underline"
          >Sign in</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "auth" });
useSeo({ title: "Create Account", noIndex: true });

const supabase = useSupabaseClient();
const { fetchProfile } = useAuth();
const router = useRouter();

const fullName = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: { data: { full_name: fullName.value } },
    });

    if (signUpError) throw signUpError;

    // Update the auto-created profile with the full name
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ full_name: fullName.value })
        .eq("id", data.user.id);

      await fetchProfile();
    }

    // Email confirmation is disabled — push straight to dashboard
    await router.push("/dashboard");
  } catch (e: any) {
    error.value = e?.message ?? "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
