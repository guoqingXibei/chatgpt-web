<script lang='ts' setup>
import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from './components'
import { useScroll } from './hooks/useScroll'
import { useCopyCode } from './hooks/useCopyCode'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { fetchAnswerAPIProcess } from '@/api'

let controller = new AbortController()

useCopyCode()

const { isMobile } = useBasicLayout()
const { scrollRef, scrollToBottom } = useScroll()
const inputRef = ref<Ref | null>(null)
const reply = ref<string>('')
const error = ref<boolean>(false)
const loading = ref<boolean>(true)

const route = useRoute()

async function displayAnswer() {
  controller = new AbortController()
  scrollToBottom()
  try {
    const fetchChatAPIOnce = async () => {
      await fetchAnswerAPIProcess<Chat.ConversationResponse>({
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          reply.value = responseText
        },
        msgId: `${route.query.msgId}`,
      })
    }
    await fetchChatAPIOnce()
  }
  catch (_error: any) {
    error.value = true
  }
  finally {
    loading.value = false
  }
}

displayAnswer()

onMounted(() => {
  scrollToBottom()
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})

onUnmounted(() => {
  if (loading.value)
    controller.abort()
})
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          id="image-wrapper"
          :class="[isMobile ? 'p-2' : 'p-4']"
          class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
        >
          <div>
            <Message
              :error="error"
              :loading="loading"
              :text="reply"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
