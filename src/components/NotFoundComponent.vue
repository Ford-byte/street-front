<template>
  <div
    class="not-found bg-white w-full h-full flex flex-col items-center justify-center text-black"
  >
    <svg
      class="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="100"
      height="100"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="black"
        stroke-width="4"
        fill="transparent"
      />
      <line x1="16" y1="16" x2="48" y2="48" stroke="black" stroke-width="4" />
      <line x1="48" y1="16" x2="16" y2="48" stroke="black" stroke-width="4" />
    </svg>
    <h1 class="mt-4 text-2xl">Page Not Found</h1>
    <p class="mt-2">The page you are looking for does not exist.</p>
    <p class="mt-2">Please reload immediately.</p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.not-found {
  font-family: Arial, sans-serif;
  height: 100vh;
  text-align: center;
}
.icon {
  margin-bottom: 16px;
}

h1 {
  font-weight: bold;
}

p {
  font-size: 1.2rem;
}
</style>
