<script setup>
import { h } from 'vue'
import { useToast } from '@/components/ui/toast'
import { 
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2
} from 'lucide-vue-next'

const { toast } = useToast()

const createToast = ({
  title,
  description,
  icon,
  variant = 'default',
  iconClass = '',
  borderClass = ''
}) => {
  toast({
    variant,
    className: `bg-background border rounded-xl shadow-lg ${borderClass}`,
    style: 'padding: 16px;',
    action: h('div', { class: 'flex w-full items-start gap-4 px-1' }, [
      h('div', { class: `rounded-full p-2 ${iconClass}` }, [
        h(icon, { class: 'h-5 w-5' })
      ]),
      h('div', { class: 'grid gap-2 w-full' }, [
        h('div', { class: 'text-sm font-semibold leading-none' }, title),
        h('div', { class: 'text-sm opacity-90 leading-relaxed' }, description)
      ])
    ])
  })
}

const showAddSuccess = (gradeName) => {
  createToast({
    title: 'Grade Level Added',
    description: `Successfully added grade level "${gradeName}"`,
    icon: CheckCircle2,
    iconClass: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400',
    borderClass: 'border-green-200 dark:border-green-800'
  })
}

const showUpdateSuccess = (gradeName) => {
  createToast({
    title: 'Grade Level Updated',
    description: `Successfully updated to "${gradeName}"`,
    icon: CheckCircle2,
    iconClass: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400',
    borderClass: 'border-green-200 dark:border-green-800'
  })
}

const showDeleteSuccess = (gradeName) => {
  createToast({
    title: 'Grade Level Deleted',
    description: `Successfully deleted "${gradeName}"`,
    icon: Info,
    iconClass: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800'
  })
}

const showError = (operation, message) => {
  createToast({
    title: `Failed to ${operation} Grade Level`,
    description: message || 'An unexpected error occurred. Please try again.',
    icon: AlertCircle,
    variant: 'destructive',
    iconClass: 'bg-destructive/20 text-destructive dark:bg-destructive/30',
    borderClass: 'border-destructive/50 dark:border-destructive/50'
  })
}

defineExpose({
  showAddSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showError
})
</script>

<template>
  <!-- This component only provides toast functionality, no template needed -->
</template>