<!-- components/ImageUploader.vue -->
<template>
  <div>
    <!-- Uploaded previews -->
    <div v-if="images.length > 0" class="grid grid-cols-3 gap-3 mb-4">
      <div
        v-for="(img, idx) in images"
        :key="img.url"
        class="relative aspect-[4/3] rounded-md overflow-hidden bg-surface-2 border border-surface-3 group"
      >
        <img
          :src="img.url"
          :alt="`Image ${idx + 1}`"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <button
            type="button"
            class="p-1.5 rounded-full bg-white/90 hover:bg-white transition"
            title="Set as primary"
            @click="setPrimary(idx)"
          >
            <UIcon
              :name="
                img.is_primary ? 'i-heroicons-star-solid' : 'i-heroicons-star'
              "
              class="w-4 h-4 text-amber-500"
            />
          </button>
          <button
            type="button"
            class="p-1.5 rounded-full bg-white/90 hover:bg-white transition"
            title="Remove"
            @click="remove(idx)"
          >
            <UIcon name="i-heroicons-trash" class="w-4 h-4 text-red-500" />
          </button>
        </div>
        <span
          v-if="img.is_primary"
          class="absolute top-1.5 left-1.5 text-[10px] font-body font-500 bg-amber-400 text-white px-1.5 py-0.5 rounded-sm"
        >
          Primary
        </span>
      </div>

      <!-- Add more slot -->
      <label
        v-if="images.length < maxImages"
        class="aspect-[4/3] rounded-md border-2 border-dashed border-surface-3 hover:border-brand flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-surface-2 hover:bg-brand-subtle"
      >
        <UIcon name="i-heroicons-plus" class="w-5 h-5 text-ink-faint" />
        <span class="text-xs font-body text-ink-faint">Add</span>
        <input
          type="file"
          class="sr-only"
          accept="image/*"
          multiple
          @change="handleFiles"
        />
      </label>
    </div>

    <!-- Initial drop zone -->
    <label
      v-else
      class="flex flex-col items-center justify-center gap-3 p-8 rounded-lg border-2 border-dashed border-surface-3 hover:border-brand cursor-pointer transition-colors bg-surface-2 hover:bg-brand-subtle"
    >
      <UIcon name="i-heroicons-photo" class="w-8 h-8 text-ink-faint" />
      <div class="text-center">
        <p class="text-sm font-body font-500 text-ink-soft">
          Upload car photos
        </p>
        <p class="text-xs font-body text-ink-faint mt-1">
          PNG, JPG up to 5MB each. First image will be primary.
        </p>
      </div>
      <input
        type="file"
        class="sr-only"
        accept="image/*"
        multiple
        @change="handleFiles"
      />
    </label>

    <p
      v-if="uploading"
      class="text-xs font-body text-ink-muted mt-2 flex items-center gap-1.5"
    >
      <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" />
      Uploading...
    </p>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

interface UploadedImage {
  url: string;
  is_primary: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: UploadedImage[];
    maxImages?: number;
  }>(),
  {
    modelValue: () => [],
    maxImages: 6,
  },
);

const emit = defineEmits<{
  "update:modelValue": [UploadedImage[]];
}>();

const images = ref<UploadedImage[]>(
  props.modelValue.map((img, i) => ({ ...img, is_primary: i === 0 })),
);
const uploading = ref(false);

const handleFiles = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;

  uploading.value = true;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not authenticated");

    for (const file of files) {
      if (images.value.length >= props.maxImages) break;

      const ext = file.name.split(".").pop();

      // ✅ FIX: include user.id as first folder
      const path = `${user.id}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("car-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("car-images").getPublicUrl(path);

      images.value.push({
        url: publicUrl,
        is_primary: images.value.length === 0,
      });
    }

    emit("update:modelValue", images.value);
  } catch (err) {
    console.error("Upload failed:", err);
  } finally {
    uploading.value = false;
    input.value = "";
  }
};

const setPrimary = (idx: number) => {
  images.value = images.value.map((img: any, i: number) => ({
    ...img,
    is_primary: i === idx,
  }));
  emit("update:modelValue", images.value);
};

const remove = (idx: number) => {
  images.value.splice(idx, 1);
  // Ensure one primary
  if (images.value.length > 0 && !images.value.some((i) => i.is_primary)) {
    images.value[0].is_primary = true;
  }
  emit("update:modelValue", images.value);
};
</script>
