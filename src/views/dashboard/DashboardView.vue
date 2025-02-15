<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="px-6 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Breadcrumb />
    </div>
    <main class="flex-1 bg-background">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from '@/components/layout/header/Header.vue'
import Breadcrumb from '@/components/layout/breadcrumb/Breadcrumb.vue'
</script>