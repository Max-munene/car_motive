<!-- pages/auth/login.vue -->
<template>
  <div class="w-full max-w-sm">
    <div class="bg-surface rounded-xl border border-surface-3 shadow-card p-8">
      <div class="text-center mb-7">
        <BrimLogo class="justify-center mb-4" />
        <h1 class="font-display text-2xl text-ink">Sign In</h1>
        <p class="font-body text-sm text-ink-muted mt-1">Welcome back</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleLogin">
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
          <div class="flex justify-between mb-1.5">
            <label class="text-xs font-body font-500 text-ink-muted"
              >Password</label
            >
            <NuxtLink
              to="/auth/forgot-password"
              class="text-xs font-body text-brand hover:underline"
            >
              Forgot password?
            </NuxtLink>
          </div>
          <UInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            autocomplete="current-password"
            class="font-body"
            required
          >
            <template #trailing>
              <button type="button" @click="showPassword = !showPassword">
                <UIcon
                  :name="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                  class="w-4 h-4 text-ink-faint hover:text-ink-soft transition-colors"
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
          Sign In
        </UButton>
      </form>

      <p class="text-center text-sm font-body text-ink-muted mt-6">
        No account?
        <NuxtLink to="/auth/register" class="text-brand hover:underline"
          >Create one</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'nuxt/app';
import { ref } from 'vue';
import { useAuth } from '../../composables/useAuth';

definePageMeta({ layout: "auth" });
useSeo({ title: "Sign In", noIndex: true });

const { signIn } = useAuth();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  try {
    const { profile: signedInProfile } = await signIn(
      email.value,
      password.value,
    );

//        const { data: profile } = await supabase
//   .from('profiles')
//   .select('id')
//   .eq('id', user.id)
//   .single();

// if (!profile) {
//   throw new Error('Profile does not exist');
// }


 
    const redirectParam = route.query.redirect as string | undefined;

    if (redirectParam && !redirectParam.startsWith("/auth")) {
      await router.push(redirectParam);
    } else if (signedInProfile?.role === "admin") {
      await router.push("/admin");
    } else {
      await router.push("/dashboard");
    }
  } catch (e: any) {
    error.value =
      e?.message ?? "Sign in failed. Check your email and password.";
  } finally {
    loading.value = false;
  }
};
</script>
