<template>
  <div flex-col bg-white min-w-70 :style="checkMainPageWindow() ? '' : asiderWidth" :class="[checkMainPageWindow() ? 'flex-grow' : '', checkOtherPageWindow() ? 'hidden' : 'flex']" ref="aside">
    <keep-alive>
      <asideGroupItem v-if="switchAside.item === 'group'"></asideGroupItem>
      <asideTaskItem v-else-if="switchAside.item === 'task'"></asideTaskItem>
    </keep-alive>
  </div>
  <div absolute h-full :class="[checkMainPageWindow() ? 'hidden' : '', checkOtherPageWindow() ? 'hidden' : '']">
    <div relative top-0 h-full bg-gray-400 :style="separatorStyle" ref="separator"></div>
  </div>
</template>

<script setup lang="ts">
// 控制切换侧边栏内容
import { SwitchAside } from "@/stores/switch/SwitchAside"
const switchAside = SwitchAside()
const optionIsActive = ref(switchAside.isActive)

// 控制侧边栏宽度代码
const separator = ref() // 绑定拉伸条
const aside = ref() // 绑定侧边条
const isActive = ref<boolean>(false) //鼠标是否接触到侧边栏
const minSpace = reactive({ isActive: false, status: false }) //判断进入最小空间条件
const _x = reactive({ start: 0, last: 0 }) //开始拉伸的初始位置 和 最后位置

const { x } = useMouse() // 获取鼠标移动的水平坐标
const { pressed } = useMousePressed() // 获取鼠标是否点击
const { isOutside } = useMouseInElement(separator) // 鼠标是否在拉伸条外面

const getWidthControl = () => ({
  defalut: 340, // 侧边栏 初始宽度
  start: 320, // 侧边栏 最小"长"宽度
  end: 300, // 侧边栏 突变宽度
  min: 280, // 侧边栏 最小宽度
  max: 400, // 侧边栏 最大宽度
  sepWidth: 2, // 侧边栏 宽度
  sepBoldWidth: 8, // 侧边栏 变粗宽度
})
let widthControl = getWidthControl()

// 保存侧边栏位置
const divWidth = useStorage("asider-width", widthControl.defalut)
const divLeft = ref<number>(optionIsActive.value ? switchAside.optionWidth.valueOf() : 0)
const divRight = ref<number>(0)

// 防止出现什么乱七八糟的数字
if ((divWidth.value < widthControl.start && divWidth.value > widthControl.end) || divWidth.value < widthControl.min || divWidth.value > widthControl.max) {
  divWidth.value = widthControl.start
}

// 侧边栏宽度
const asiderWidth = reactive({
  width: divWidth.value + "px",
})

// 拉伸条宽度以及位置
const separatorStyle = reactive({
  left: divWidth.value + divLeft.value - widthControl.sepWidth / 2 + "px",
  width: widthControl.sepWidth + "px",
})

// 监听是不是关闭了option
watch(switchAside, () => {
  if (optionIsActive.value !== switchAside.isActive) {
    optionIsActive.value = switchAside.isActive
    widthControl = getWidthControl()
    divLeft.value = optionIsActive.value ? switchAside.optionWidth.valueOf() : 0
    separatorStyle.left = divWidth.value + divLeft.value - widthControl.sepWidth / 2 + "px"
    console.log(divLeft.value, separatorStyle.left)
  }
})

// 监听鼠标水平方向运动
watch(x, () => {
  // 当按下鼠标 状态为激活 且鼠标不是直接从左一直按住到右边 的时候 才能修改width
  if (pressed.value && isActive.value && _x.start >= divRight.value && x.value <= widthControl.max) {
    // 让鼠标居中拖拉栏
    if (x.value >= widthControl.start + divLeft.value) {
      // 宽度等于
      divWidth.value = x.value - divLeft.value
      separatorStyle.left = divWidth.value + divLeft.value + "px"
      asiderWidth.width = divWidth.value + "px"
    }
    // 判断是否进入最小空间
    minSpace.isActive = !(x.value > widthControl.start)
  }

  // 拉最小宽度
  if (pressed.value && minSpace.status && x.value < widthControl.end && _x.last > x.value) {
    asiderWidth.width = widthControl.start + "px"
    separatorStyle.left = widthControl.start - divLeft.value + "px"
    minSpace.status = false
  }

  // 当鼠标水平运动小于某个大小 且满足进入最小空间 需要按住鼠标
  if (pressed.value && minSpace.isActive && x.value <= widthControl.end && !minSpace.status) {
    divWidth.value = widthControl.min
    asiderWidth.width = divWidth.value + "px"
    separatorStyle.left = divWidth.value + divLeft.value + "px"
    minSpace.isActive = false
    minSpace.status = true
  }

  // 获取上次运动的x值
  _x.last = x.value
})

// 可以用定位 但是left调不动
watch(isOutside, () => {
  // 如果打开了diglog 那就不激活了
  if (!switchAside.hasDiglog) {
    // 当进入拉伸区域 修改为激活
    if (_x.start >= x.value - widthControl.sepBoldWidth / 2 && _x.start <= x.value + widthControl.sepBoldWidth) {
      isActive.value = isOutside.value ? true : isActive.value
    }
    if (_x.start >= x.value - widthControl.sepBoldWidth && _x.start <= x.value + widthControl.sepBoldWidth / 2) {
      isActive.value = isOutside.value ? true : isActive.value
    }
    // 当鼠标经过时候拉伸栏时候延迟变宽
    if (!pressed.value) {
      separatorStyle.left = isOutside.value ? divWidth.value + divLeft.value - widthControl.sepWidth / 2 + "px" : divWidth.value + divLeft.value - widthControl.sepBoldWidth / 2 + "px"
      separatorStyle.width = isOutside.value ? widthControl.sepWidth + "px" : widthControl.sepBoldWidth + "px"
      document.body.style.cursor = isOutside.value ? "default" : "col-resize"
    }
  }
})

// 监听鼠标是否触发点击
watch(pressed, () => {
  // 当鼠标放开 修改为失效
  useTimeoutFn(() => {
    isActive.value = !pressed.value ? false : isActive.value
  }, 500)
  // 获取开始点击位置
  _x.start = x.value
  // 忘了
  divRight.value = divWidth.value + divLeft.value - widthControl.sepBoldWidth / 2
  // 如果在拉伸区域 且鼠标触发点击状态切换 还原侧边栏【监听是否松开】
  if (!pressed.value) {
    separatorStyle.left = divWidth.value + divLeft.value - widthControl.sepWidth / 2 + "px"
    document.body.style.cursor = "default"
    separatorStyle.width = widthControl.sepWidth + "px"
  }
})

// === 屏幕检测 ===
const router = useRouter()
const routerName = ref(router.currentRoute.value.name)
const window = useWindowSize()
watch(router.currentRoute, () => {
  routerName.value = router.currentRoute.value.name
})
const checkMainPageWindow = () => {
  return routerName.value === "main" && window.width.value <= 768
}
const checkOtherPageWindow = () => {
  return routerName.value !== "main" && window.width.value <= 768
}
// ============
</script>
