可以，下面我直接给你一份**可复用版 Vue 3 组件方案**。
目标是两件事：

1. **尽量保留 vue-bits 首页那个味道**
2. **改造成你项目里能长期复用的组件**

这个版本我建议你命名为：

`PlasmaWaveBackground.vue`

---

# 一、先说结论：这个组件本质上是什么

它本质是：

- 一个 **全屏绝对定位容器**
- 内部用 **`ogl`** 跑一个 fragment shader
- 用 `requestAnimationFrame` 驱动时间
- 用 `ResizeObserver` 做自适应
- 用 `IntersectionObserver` 控制离开视口时暂停
- 用 props 控制偏移、旋转、透明度渐入、颜色等参数

也就是说，它不是普通 CSS 动画，而是一个 **轻量 WebGL shader 背景组件**。

---

# 二、依赖安装

先装 `ogl`：

```bash
pnpm add ogl
```

或者：

```bash
npm install ogl
```

---

# 三、推荐目录结构

```txt
src/
  components/
    background/
      PlasmaWaveBackground.vue
```

---

# 四、可直接复制的组件代码

## `src/components/background/PlasmaWaveBackground.vue`

```vue
<script setup lang="ts">
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";
import { onBeforeUnmount, onMounted, onUnmounted, ref, watch } from "vue";

type Vec3Color = [number, number, number];

export interface PlasmaWaveBackgroundProps {
	xOffset?: number;
	yOffset?: number;
	rotationDeg?: number;
	focalLength?: number;
	speed1?: number;
	speed2?: number;
	dir2?: number;
	bend1?: number;
	bend2?: number;
	bendAdj1?: number;
	bendAdj2?: number;
	fadeInDuration?: number;
	opacity?: number;
	mobileBreakpoint?: number;
	pauseWhenOffscreen?: boolean;
	bottomFadeHeight?: number;
	showBottomFade?: boolean;
	colorA?: Vec3Color;
	colorB?: Vec3Color;
}

const props = withDefaults(defineProps<PlasmaWaveBackgroundProps>(), {
	xOffset: 40,
	yOffset: 0,
	rotationDeg: -45,
	focalLength: 1,
	speed1: 0.1,
	speed2: 0.1,
	dir2: 1,
	bend1: 0.9,
	bend2: 0.6,
	bendAdj1: 0,
	bendAdj2: 0,
	fadeInDuration: 2000,
	opacity: 1,
	mobileBreakpoint: 768,
	pauseWhenOffscreen: true,
	bottomFadeHeight: 200,
	showBottomFade: true,
	colorA: () => [0.259, 0.722, 0.514], // Vue green
	colorB: () => [0.208, 0.286, 0.369], // Vue dark
});

const vertex = /* glsl */ `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
precision mediump float;

uniform float iTime;
uniform vec2  iResolution;
uniform vec2  uOffset;
uniform float uRotation;
uniform float focalLength;
uniform float speed1;
uniform float speed2;
uniform float dir2;
uniform float bend1;
uniform float bend2;
uniform float bendAdj1;
uniform float bendAdj2;
uniform float uOpacity;
uniform vec3  colorA;
uniform vec3  colorB;

const float lt   = 0.3;
const float pi   = 3.141592653589793;
const float pi2  = pi * 2.0;
const float pi_2 = pi * 0.5;

#define MAX_STEPS 15

void mainImage(out vec4 C, in vec2 U) {
  float t = iTime * pi;
  float s = 1.0;
  float d = 0.0;
  vec2  R = iResolution;

  vec3 o = vec3(0.0, 0.0, -7.0);
  vec3 u = normalize(vec3((U - 0.5 * R) / R.y, focalLength));
  vec3 k = vec3(0.0);
  vec3 p;

  float t1 = t * 0.7;
  float t2 = t * 0.9;
  float tSpeed1 = t * speed1;
  float tSpeed2 = t * speed2 * dir2;

  for (int step = 0; step < MAX_STEPS; ++step) {
    p = o + u * d;
    p.x -= 15.0;

    float px = p.x;
    float wob1 = bend1 + bendAdj1 + sin(t1 + px * 0.8) * 0.1;
    float wob2 = bend2 + bendAdj2 + cos(t2 + px * 1.1) * 0.1;

    float px2 = px + pi_2;
    vec2 baseOffset = vec2(px, px2);
    vec2 sinOffset = sin(baseOffset + tSpeed1) * wob1;
    vec2 cosOffset = cos(baseOffset + tSpeed2) * wob2;

    vec2 yz = p.yz;
    float wSin = length(yz - sinOffset) - lt;
    float wCos = length(yz - cosOffset) - lt;

    k.x = max(px + lt, wSin);
    k.y = max(px + lt, wCos);

    float current = min(k.x, k.y);
    s = min(s, current);

    if (s < 0.001 || d > 400.0) break;
    d += s * 0.7;
  }

  vec3 c = max(cos(d * pi2) - s * sqrt(d) - k, 0.0);
  c.gb += 0.1;

  vec3 finalColor = vec3(0.0);
  if (k.x < k.y) {
    finalColor = colorA * c.x;
  } else {
    finalColor = colorB * c.y;
  }

  float intensity = max(finalColor.r, max(finalColor.g, finalColor.b));
  if (intensity < 0.15) discard;

  finalColor = finalColor * 0.4 + finalColor.brg * 0.6 + finalColor * finalColor;
  C = vec4(clamp(finalColor, 0.0, 1.0), uOpacity);
}

void main() {
  vec2 coord = gl_FragCoord.xy + uOffset;
  coord -= 0.5 * iResolution;

  float c = cos(uRotation);
  float s = sin(uRotation);
  coord = mat2(c, -s, s, c) * coord;

  coord += 0.5 * iResolution;

  vec4 color;
  mainImage(color, coord);
  gl_FragColor = color;
}
`;

const containerRef = ref<HTMLElement | null>(null);
const isMobile = ref(false);
const isVisible = ref(true);

const rendererRef = ref<Renderer | null>(null);
const uniformOffset = ref(new Float32Array([props.xOffset, props.yOffset]));
const uniformResolution = ref(new Float32Array([1, 1]));

const fadeStartTime = ref<number | null>(null);
const lastTimeRef = ref(0);
const pausedTimeRef = ref(0);

let cleanup: (() => void) | null = null;
let removeResizeListener: (() => void) | null = null;
let removeObserver: (() => void) | null = null;

const checkMobile = () => {
	if (typeof window === "undefined") return;
	isMobile.value = window.innerWidth <= props.mobileBreakpoint;
};

const setupResizeListener = () => {
	checkMobile();
	const onResize = () => checkMobile();
	window.addEventListener("resize", onResize);
	removeResizeListener = () => {
		window.removeEventListener("resize", onResize);
	};
};

const setupObserver = () => {
	removeObserver?.();

	if (!props.pauseWhenOffscreen || !containerRef.value || isMobile.value) {
		isVisible.value = true;
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			isVisible.value = entry.isIntersecting;
		},
		{
			rootMargin: "50px",
			threshold: 0.1,
		},
	);

	observer.observe(containerRef.value);
	removeObserver = () => observer.disconnect();
};

const setup = () => {
	if (!containerRef.value) return;
	if (isMobile.value) return;

	const renderer = new Renderer({
		alpha: true,
		dpr: Math.min(window.devicePixelRatio || 1, 1),
		antialias: false,
		depth: false,
		stencil: false,
		powerPreference: "high-performance",
	});

	rendererRef.value = renderer;

	const gl = renderer.gl;
	gl.clearColor(0, 0, 0, 0);

	containerRef.value.appendChild(gl.canvas);

	const camera = new Camera(gl);
	const scene = new Transform();

	const geometry = new Geometry(gl, {
		position: {
			size: 2,
			data: new Float32Array([-1, -1, 3, -1, -1, 3]),
		},
	});

	const program = new Program(gl, {
		vertex,
		fragment,
		uniforms: {
			iTime: { value: 0 },
			iResolution: { value: uniformResolution.value },
			uOffset: { value: uniformOffset.value },
			uRotation: { value: 0 },
			focalLength: { value: props.focalLength },
			speed1: { value: props.speed1 },
			speed2: { value: props.speed2 },
			dir2: { value: props.dir2 },
			bend1: { value: props.bend1 },
			bend2: { value: props.bend2 },
			bendAdj1: { value: props.bendAdj1 },
			bendAdj2: { value: props.bendAdj2 },
			uOpacity: { value: 0 },
			colorA: { value: new Float32Array(props.colorA) },
			colorB: { value: new Float32Array(props.colorB) },
		},
	});

	new Mesh(gl, { geometry, program }).setParent(scene);

	const resize = () => {
		const rect = containerRef.value?.getBoundingClientRect();
		const width = rect?.width ?? 0;
		const height = rect?.height ?? 0;

		renderer.setSize(width, height);
		uniformResolution.value[0] = width * renderer.dpr;
		uniformResolution.value[1] = height * renderer.dpr;

		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		gl.clear(gl.COLOR_BUFFER_BIT);
	};

	resize();

	const resizeObserver = new ResizeObserver(() => {
		resize();
	});
	resizeObserver.observe(containerRef.value);

	let rafId = 0;

	const loop = (now: number) => {
		if (isVisible.value) {
			if (lastTimeRef.value === 0) {
				lastTimeRef.value = now - pausedTimeRef.value;
			}

			const t = (now - lastTimeRef.value) * 0.001;

			if (fadeStartTime.value === null && t > 0.1) {
				fadeStartTime.value = now;
			}

			let opacity = 0;
			if (fadeStartTime.value !== null) {
				const fadeElapsed = now - fadeStartTime.value;
				opacity = Math.min(fadeElapsed / props.fadeInDuration, 1);
				opacity = 1 - Math.pow(1 - opacity, 3);
			}

			uniformOffset.value[0] = props.xOffset;
			uniformOffset.value[1] = props.yOffset;

			program.uniforms.iTime.value = t;
			program.uniforms.uRotation.value = (props.rotationDeg * Math.PI) / 180;
			program.uniforms.focalLength.value = props.focalLength;
			program.uniforms.speed1.value = props.speed1;
			program.uniforms.speed2.value = props.speed2;
			program.uniforms.dir2.value = props.dir2;
			program.uniforms.bend1.value = props.bend1;
			program.uniforms.bend2.value = props.bend2;
			program.uniforms.bendAdj1.value = props.bendAdj1;
			program.uniforms.bendAdj2.value = props.bendAdj2;
			program.uniforms.uOpacity.value = opacity * props.opacity;
			program.uniforms.colorA.value = new Float32Array(props.colorA);
			program.uniforms.colorB.value = new Float32Array(props.colorB);

			renderer.render({ scene, camera });
		} else {
			if (lastTimeRef.value !== 0) {
				pausedTimeRef.value = now - lastTimeRef.value;
				lastTimeRef.value = 0;
			}
		}

		rafId = window.requestAnimationFrame(loop);
	};

	rafId = window.requestAnimationFrame(loop);

	cleanup = () => {
		window.cancelAnimationFrame(rafId);
		resizeObserver.disconnect();
		renderer.gl.canvas.remove();
		rendererRef.value = null;
	};
};

const rebuild = () => {
	cleanup?.();
	fadeStartTime.value = null;
	lastTimeRef.value = 0;
	pausedTimeRef.value = 0;
	setupObserver();
	setup();
};

onMounted(() => {
	setupResizeListener();
	setupObserver();
	setup();
});

onUnmounted(() => {
	removeResizeListener?.();
	removeObserver?.();
});

onBeforeUnmount(() => {
	cleanup?.();
});

watch(
	() => isMobile.value,
	() => {
		rebuild();
	},
);

watch(
	() => props.pauseWhenOffscreen,
	() => {
		setupObserver();
	},
);
</script>

<template>
	<div
		ref="containerRef"
		class="plasma-wave-background"
		:style="{
			position: 'absolute',
			inset: '0',
			overflow: 'hidden',
			width: '100%',
			height: '100%',
		}"
	>
		<slot />

		<div
			v-if="showBottomFade && !isMobile"
			:style="{
				position: 'absolute',
				left: '0',
				right: '0',
				bottom: '0',
				height: `${bottomFadeHeight}px`,
				background: 'linear-gradient(to top, #0b0b0b 20%, transparent)',
				pointerEvents: 'none',
				zIndex: 1,
			}"
		/>
	</div>
</template>

<style scoped>
.plasma-wave-background {
	pointer-events: none;
}

.plasma-wave-background :deep(canvas) {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
```

---

# 五、最小使用方式

## 1）作为首页 Hero 背景

```vue
<script setup lang="ts">
import PlasmaWaveBackground from "@/components/background/PlasmaWaveBackground.vue";
</script>

<template>
	<section class="hero-section">
		<PlasmaWaveBackground :x-offset="40" :y-offset="0" :rotation-deg="-45" />

		<div class="hero-content">
			<h1>你的标题</h1>
			<p>你的副标题</p>
		</div>
	</section>
</template>

<style scoped>
.hero-section {
	position: relative;
	min-height: 100vh;
	overflow: hidden;
	background: #0b0b0b;
}

.hero-content {
	position: relative;
	z-index: 2;
}
</style>
```

---

## 2）如果你想更像 vue-bits 官网

官网味道关键就是这几个参数：

```vue
<PlasmaWaveBackground
	:x-offset="40"
	:y-offset="0"
	:rotation-deg="-45"
	:focal-length="1"
	:speed1="0.1"
	:speed2="0.1"
	:bend1="0.9"
	:bend2="0.6"
	:fade-in-duration="2000"
/>
```

---

# 六、你最该调的几个参数

这个组件不用一上来全动，先记住这几个最重要的。

### `rotationDeg`

控制整体斜切方向。

- `-45`：最接近官网味道
- `0`：横向感更强
- `45`：方向反过来

---

### `xOffset` / `yOffset`

控制背景波形在画面里的位置。

```vue
:x-offset="40" :y-offset="0"
```

想让主视觉更偏左或偏右，就先改这个。

---

### `speed1` / `speed2`

控制两组波的流动速度。

```vue
:speed1="0.08" :speed2="0.12"
```

你如果想更“优雅克制”，建议速度再小一点。

---

### `bend1` / `bend2`

控制弯曲程度。

```vue
:bend1="0.9" :bend2="0.6"
```

值越大，波形越夸张。

---

### `colorA` / `colorB`

这是我帮你加的增强版能力，原始味道是 Vue 绿 + 深蓝灰。

```vue
:color-a="[0.259, 0.722, 0.514]" :color-b="[0.208, 0.286, 0.369]"
```

如果你以后做自己品牌风格，可以直接换。

例如紫蓝风：

```vue
:color-a="[0.55, 0.35, 0.95]" :color-b="[0.16, 0.22, 0.45]"
```

---

# 七、为什么我建议你这样封装，而不是原样照搬

原版能用，但更偏官网私有实现。
我帮你改成“项目组件”后，主要多了这些好处：

### 1. 颜色可配置

原版颜色写死了。你以后做品牌化会很痛苦。

### 2. 容器更通用

原版更像直接占满 `100vw / 100vh` 的 landing 背景。
我这里改成了：

- `width: 100%`
- `height: 100%`

这样它既能做整屏背景，也能做局部 section 背景。

### 3. 移动端断点可控

原版移动端是官网自己的逻辑。
我给你留了：

```ts
mobileBreakpoint;
```

以后你能自己决定在哪个断点停掉 WebGL。

### 4. 可暂停离屏渲染

做长页面时，这个非常值钱。否则多个 section 同时跑 shader，性能会炸。

---

# 八、如果你想做得更完整，我建议再加一个“移动端回退图”版本

你如果要完全照官网体验，建议再加一个 props：

```ts
mobileImage?: string
```

然后移动端不渲染 WebGL，改用图片。

你可以这么扩展模板：

```vue
<template>
	<div
		ref="containerRef"
		class="plasma-wave-background"
		:style="{
			position: 'absolute',
			inset: '0',
			overflow: 'hidden',
			width: '100%',
			height: '100%',
		}"
	>
		<img
			v-if="isMobile && mobileImage"
			:src="mobileImage"
			alt="background"
			style="width: 100%; height: 100%; object-fit: cover; display: block;"
		/>

		<slot />

		<div
			v-if="showBottomFade && !isMobile"
			:style="{
				position: 'absolute',
				left: '0',
				right: '0',
				bottom: '0',
				height: `${bottomFadeHeight}px`,
				background: 'linear-gradient(to top, #0b0b0b 20%, transparent)',
				pointerEvents: 'none',
				zIndex: 1,
			}"
		/>
	</div>
</template>
```

然后 props 加：

```ts
mobileImage?: string
```

---

# 九、如果你是 Nuxt 3，要注意一件事

这个组件依赖浏览器环境：

- `window`
- `ResizeObserver`
- `IntersectionObserver`
- WebGL canvas

所以在 Nuxt 里，最好这样用：

```vue
<ClientOnly>
  <PlasmaWaveBackground />
</ClientOnly>
```

否则 SSR 阶段你会踩环境问题。

---

# 十、我建议你的最终落地方案

如果你想在自己项目里长期复用，我建议拆成两层：

## 方案 A：底层组件

`PlasmaWaveBackground.vue`

负责：

- shader
- 渲染
- props 控制
- observer / resize / pause

## 方案 B：业务包装组件

`HeroBackground.vue`

负责：

- 你的默认色板
- 你的默认参数
- 移动端图片降级
- 叠加遮罩 / 渐变 / 噪声层

例如：

```vue
<script setup lang="ts">
import PlasmaWaveBackground from "@/components/background/PlasmaWaveBackground.vue";
</script>

<template>
	<PlasmaWaveBackground
		:x-offset="40"
		:rotation-deg="-45"
		:speed1="0.1"
		:speed2="0.1"
		:bend1="0.9"
		:bend2="0.6"
		:color-a="[0.259, 0.722, 0.514]"
		:color-b="[0.208, 0.286, 0.369]"
	/>
</template>
```

这样以后你全站都能统一背景语言。

---

# 十一、你接下来最值得做的两个增强

### 增强 1：加 `mix-blend-mode` 叠层

可以叠一点噪声、光晕、网格，会更高级。

### 增强 2：加鼠标联动

你可以把 `xOffset / yOffset` 跟鼠标位置绑定，做轻微视差。

例如：

```ts
const handleMouseMove = (e: MouseEvent) => {
	const x = (e.clientX / window.innerWidth - 0.5) * 40;
	const y = (e.clientY / window.innerHeight - 0.5) * 40;
};
```

这样能做出更“活”的首页。

---

# 十二、我给你的实话建议

如果你的目标是：

**“我想照抄 vue-bits 首页那种高级感，而且以后能在自己项目反复复用。”**

那最优路线不是机械复制官网源码，而是：

- 保留 shader 核心
- 把颜色做成 props
- 把尺寸从 `100vw/100vh` 改成容器自适应
- 增加移动端降级
- 增加离屏暂停

我上面这份就是按这个思路整理过的，已经比原版更适合你自己的项目。

如果你愿意，我下一条可以直接继续给你：

**一个“更像 vue-bits 官网首页”的完整 Hero Section 示例**
也就是把这个背景组件 + 标题 + 按钮 + 渐变遮罩 + 内容层级，一起拼成一个成品页面段落。
