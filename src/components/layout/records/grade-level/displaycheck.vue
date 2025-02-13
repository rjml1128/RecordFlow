<script setup>
import GradeLevelEmptyState from './GradeLevelEmptyState.vue'
import GradeLevelPlaceholder from './GradeLevelPlaceholder.vue'
import GradeLevelAdd from './GradeLevelAdd.vue'
import GradeLevelUpdate from './GradeLevelUpdate.vue'
import GradeLevelDisplay from './GradeLevelDisplay.vue'
</script>

<template>
  <div class="p-6 space-y-12">
    <h2 class="text-2xl font-bold text-gray-900">Grade Level Components</h2>
    
    <!-- Empty State -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-gray-700">Empty State</h3>
      <div class="flex justify-center">
        <GradeLevelEmptyState />
      </div>
    </div>

    <!-- Dialogs -->
    <div class="space-y-2">
      <h3 class="text-lg font-semibold text-gray-700">Dialog Components</h3>
      <div class="flex items-center gap-4">
        <GradeLevelAdd />
        <GradeLevelUpdate initial-name="Example Grade" />
      </div>
    </div>

    <!-- Cards -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-700">Grade Level Cards</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GradeLevelDisplay 
          grade-name="First Year"
          @edit="() => {}"
          @delete="() => {}"
        />
        <GradeLevelDisplay 
          grade-name="Second Year"
          @edit="() => {}"
          @delete="() => {}"
        />
        <!-- Placeholder Card (Always Last) -->
        <GradeLevelPlaceholder class="order-last" />
      </div>
    </div>
  </div>
</template>