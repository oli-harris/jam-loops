<!-- Desktop only site -->
<template>
  <div class="flex flex-col min-h-screen">
    <header class="px-8 py-4 bg-stone-950">
      <Toolbar />
    </header>
    <div class="flex flex-1 h-full">
      <aside class="w-64 bg-stone-950 border-r-2 border-rose-950">
        <LoopsSideview />
      </aside>
      <main class="flex-1 bg-stone-900 border-t-2 border-rose-950"></main>
      <!-- <aside class="w-64 bg-stone-900 border-t-2 border-l-2 border-rose-950">
        <TimelineSideview />
      </aside> -->
      </div>
  </div>
</template>