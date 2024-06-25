<template>
  <div class="loopviewer grid h-full gap-8 overflow-y-auto p-4">
    <Loop :beats="13" :tracks="1" />
    <Loop :beats="7" :tracks="3" />
    <Loop :beats="3" :tracks="4" />
    <Loop :beats="16" :tracks="4" />
  </div>
</template>

<style>
.loopviewer {
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(20rem, 1fr));
}
</style>
