<template>
  <div
    class="font-rubik min-w-screen flex min-h-screen flex-col items-center justify-center bg-stone-950 font-bold"
  >
    <div class="text-center">
      <div class="flex items-center">
        <MetaAnimateHover
          :animateOnStart="true"
          :loop="true"
          animation="animate__tada"
          classList="animate__delay-init"
        >
          <span class="font-rubik-mono cursor-default text-8xl text-rose-600">JAM</span>
        </MetaAnimateHover>

        <div class="ml-6 text-4xl font-extrabold text-rose-600">Loops</div>
      </div>

      <div class="mt-10 text-3xl leading-relaxed text-rose-200">
        Create live music. <br />Start jamming.
      </div>

      <NuxtLink to="/app">
        <button
          class="mt-32 rounded-full border-4 border-rose-600 px-4 py-2 text-xl font-semibold text-rose-200 transition-all hover:scale-[115%]"
        >
          Start Project
        </button>
      </NuxtLink>

      <div class="animate__animated mt-48 text-lg font-medium text-rose-200">
        A project by
        <MetaAnimateHover animation="animate__pulse" classList="inline-block">
          <a href="https://github.com/oli-harris">Oli Harris.</a>
        </MetaAnimateHover>
      </div>
    </div>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
