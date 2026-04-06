<!-- pages/admin/articles.vue -->
<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl text-ink">Articles</h1>
        <p class="font-body text-sm text-ink-muted mt-0.5">
          Manage car guides and knowledge articles.
        </p>
      </div>
      <UButton
        size="sm"
        class="font-body font-400 shrink-0"
        style="background-color: var(--color-brand); color: white"
        @click="openCreate"
      >
        <UIcon name="i-heroicons-plus" class="w-4 h-4" />New Article
      </UButton>
    </div>

    <div v-if="loading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-surface-2 rounded-lg h-20 img-shimmer"
      />
    </div>

    <div
      v-else-if="articles.length === 0"
      class="bg-surface rounded-lg border border-surface-3 p-12 text-center shadow-card"
    >
      <UIcon
        name="i-heroicons-document-text"
        class="w-10 h-10 text-ink-faint mx-auto mb-3"
      />
      <p class="font-display text-lg text-ink-soft">No articles yet</p>
      <p class="font-body text-sm text-ink-faint mt-1">
        Write your first car guide.
      </p>
    </div>

    <div
      v-else
      class="bg-surface rounded-lg border border-surface-3 shadow-card overflow-hidden"
    >
      <div
        v-for="article in articles"
        :key="article.id"
        class="flex items-center gap-4 px-5 py-4 border-b border-surface-3 last:border-0 hover:bg-surface-2 transition-colors"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-body font-500 text-ink truncate">
            {{ article.title }}
          </p>
          <p class="text-xs font-body text-ink-faint mt-0.5">
            {{ formatDate(article.created_at) }} · /articles/{{ article.slug }}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <UBadge
            :label="article.published ? 'Published' : 'Draft'"
            :color="article.published ? 'success' : 'neutral'"
            variant="soft"
            size="xs"
            class="font-body"
          />
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil"
            class="text-ink-faint hover:text-brand"
            @click="openEdit(article)"
          />
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-trash"
            class="text-ink-faint hover:text-red-500"
            @click="deleteArticle(article.id)"
          />
        </div>
      </div>
    </div>

    <!-- Create / Edit modal -->
    <UModal v-model:open="modal" :ui="{ width: 'max-w-2xl' }">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="font-display text-lg text-ink">
            {{ editing ? "Edit Article" : "New Article" }}
          </h3>

          <div class="space-y-3">
            <div>
              <label
                class="block text-xs font-body font-500 text-ink-muted mb-1.5"
                >Title *</label
              >
              <UInput
                v-model="form.title"
                placeholder="e.g. How to Check a Used Car"
                class="font-body"
                @input="autoSlug"
              />
            </div>
            <div>
              <label
                class="block text-xs font-body font-500 text-ink-muted mb-1.5"
                >Slug *</label
              >
              <UInput
                v-model="form.slug"
                placeholder="how-to-check-used-car"
                class="font-body"
              />
            </div>
            <div>
              <label
                class="block text-xs font-body font-500 text-ink-muted mb-1.5"
                >Excerpt</label
              >
              <UInput
                v-model="form.excerpt"
                placeholder="One sentence summary shown in listings"
                class="font-body"
              />
            </div>
            <div>
              <label
                class="block text-xs font-body font-500 text-ink-muted mb-1.5"
                >Content *</label
              >
              <textarea
                v-model="form.content"
                rows="10"
                placeholder="Write your article content here..."
                class="article-textarea"
              />
            </div>
            <div class="flex items-center gap-3">
              <input
                id="published"
                v-model="form.published"
                type="checkbox"
                class="w-4 h-4 accent-red-600"
              />
              <label
                for="published"
                class="text-sm font-body text-ink-soft cursor-pointer"
                >Published (visible to public)</label
              >
            </div>
          </div>

          <UAlert
            v-if="formError"
            color="error"
            variant="soft"
            :title="formError"
          />

          <div class="flex gap-3 justify-end pt-2">
            <UButton variant="ghost" class="font-body" @click="modal = false"
              >Cancel</UButton
            >
            <UButton
              :loading="saving"
              class="font-body font-400"
              style="background-color: var(--color-brand); color: white"
              @click="save"
            >
              {{ editing ? "Save Changes" : "Create Article" }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "~/types";

definePageMeta({ layout: "dashboard", middleware: "admin" });
useSeo({ title: "Articles", noIndex: true });

const supabase = useSupabaseClient();
const { authFetch } = useAuth();

const articles = ref<Article[]>([]);
const loading = ref(true);
const modal = ref(false);
const saving = ref(false);
const editing = ref<Article | null>(null);
const formError = ref("");

const emptyForm = () => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  published: false,
});
const form = reactive(emptyForm());

const load = async () => {
  loading.value = true;
  try {
    const res = await authFetch<any>("/api/admin/articles");
    articles.value = res?.data ?? [];
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const autoSlug = () => {
  if (!editing.value) {
    form.slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
};

const openCreate = () => {
  editing.value = null;
  Object.assign(form, emptyForm());
  formError.value = "";
  modal.value = true;
};

const openEdit = (article: Article) => {
  editing.value = article;
  Object.assign(form, {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    content: article.content,
    published: article.published,
  });
  formError.value = "";
  modal.value = true;
};

const save = async () => {
  if (!form.title || !form.slug || !form.content) {
    formError.value = "Title, slug and content are required.";
    return;
  }
  saving.value = true;
  formError.value = "";
  try {
    if (editing.value) {
      await supabase
        .from("articles")
        .update({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt || null,
          content: form.content,
          published: form.published,
        })
        .eq("id", editing.value.id);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("articles").insert({
        author_id: user!.id,
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt || null,
        content: form.content,
        published: form.published,
      });
    }
    modal.value = false;
    await load();
  } catch (e: any) {
    formError.value = e?.message ?? "Failed to save article.";
  } finally {
    saving.value = false;
  }
};

const deleteArticle = async (id: string) => {
  if (!confirm("Delete this article?")) return;
  await supabase.from("articles").delete().eq("id", id);
  await load();
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
</script>

<style scoped>
.article-textarea {
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
  line-height: 1.7;
}
.article-textarea:focus {
  border-color: var(--color-brand);
}
.article-textarea::placeholder {
  color: var(--color-ink-faint);
}
</style>
