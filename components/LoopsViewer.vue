<template>
  <div class="grid h-full overflow-y-auto gap-8 p-4">
    <Loop :beats="16", :tracks="1"/>
    <Loop :beats="8", :tracks="3"/>
    <Loop :beats="6", :tracks="4"/>
    <Loop :beats="2", :tracks="2"/>
  </div>
</template>

<style>
.grid {
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  grid-template-rows: repeat(auto-fit, minmax(22rem, 1fr));
}
</style>