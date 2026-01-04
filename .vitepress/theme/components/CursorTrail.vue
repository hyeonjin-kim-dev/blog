<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';

const svgRef = ref(null);

onMounted(() => {
  gsap.defaults({ ease: 'none' });

  const svgns = "http://www.w3.org/2000/svg";
  const root = svgRef.value;
  const ease = 0.75;

  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  const handleMouseMove = (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  };

  window.addEventListener("mousemove", handleMouseMove);

  let leader = pointer;
  const total = 100;

  for (let i = 0; i < total; i++) {
    leader = createLine(leader, i);
  }

  function createLine(leader, i) {
    const line = document.createElementNS(svgns, "line");
    root.appendChild(line);

    gsap.set(line, { x: -15, y: -15, alpha: (total - i) / total });

    gsap.to(line, {
      duration: 1000,
      x: "+=1",
      y: "+=1",
      repeat: -1,
      modifiers: {
        x: function () {
          let posX = gsap.getProperty(line, "x");
          let leaderX = gsap.getProperty(leader, "x");

          var x = posX + (leaderX - posX) * ease;
          line.setAttribute("x2", leaderX - x);
          return x;
        },
        y: function () {
          let posY = gsap.getProperty(line, "y");
          let leaderY = gsap.getProperty(leader, "y");

          var y = posY + (leaderY - posY) * ease;
          line.setAttribute("y2", leaderY - y);
          return y;
        }
      }
    });

    return line;
  }

  onUnmounted(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    gsap.killTweensOf("*");
  });
});
</script>

<template>
  <svg ref="svgRef" class="cursor-trail"></svg>
</template>

<style scoped>
.cursor-trail {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: 9999;
}

.cursor-trail :deep(line) {
  stroke: #394dfe;
  stroke-width: 2;
}
</style>
