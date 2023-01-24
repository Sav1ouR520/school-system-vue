<template>
  <div bg-red :style="asiderWidth" ref="asider">
  </div>
  <div absolute h-full>
    <div relative top-0 h-full bg-white :style="separatorStyle" ref="separator">
    </div>
  </div>
</template>

<script setup lang="ts">

const separator = ref()
const asider = ref()
const isActive = ref<boolean>(false)
const minSpace = reactive({ isActive: false, status: false, })
onMounted(() => {
  useStorage('asider-left', left)
})

const _x = reactive({ start: 0, last: 0 })
const { isOutside } = useMouseInElement(separator)
const { left,right } = useElementBounding(asider)
const { x } = useMouse()
const { pressed } = useMousePressed()
const divLeft = useStorage('asider-left', left)

const widthControl = {
  defalut: divLeft.value + 380, // 侧边栏 初始宽度
  start: divLeft.value + 280,   // 侧边栏 最小"长"宽度
  end: divLeft.value + 240,     // 侧边栏 突变宽度
  min: divLeft.value + 200,     // 侧边栏 最小宽度
  sepWidth: 2,                  // 侧边栏 宽度
  sepBoldWidth: 8               // 侧边栏 变粗宽度
}
// 保存侧边栏位置
const divWidth = useStorage('asider-width', widthControl.defalut )

// 防止出现什么乱七八糟的数字
if (divWidth.value < widthControl.start && divWidth.value > widthControl.end) {
  divWidth.value = widthControl.start
}

const asiderWidth = reactive({
  width: divWidth.value - divLeft.value+ 'px'
})

const separatorStyle = reactive({
  left: divWidth.value - widthControl.sepWidth / 2 + 'px',
  width: widthControl.sepWidth + 'px',
})

// 监听鼠标水平方向运动
watch(x, () => {
  // 当按下鼠标 状态为激活 且鼠标不是直接从左一直按住到右边 的时候 才能修改width
  if (pressed.value && isActive.value && _x.start > left.value) {
    // 让鼠标居中拖拉栏
    if (x.value >= widthControl.start + widthControl.sepBoldWidth / 2) {
      separatorStyle.left = x.value - widthControl.sepBoldWidth / 2 + 'px'
      asiderWidth.width = x.value - divLeft.value - widthControl.sepBoldWidth / 2 + 'px'
      divWidth.value = x.value - widthControl.sepBoldWidth / 2
    }
    // 判断是否进入最小空间
    minSpace.isActive = !(x.value > widthControl.start)
  }

  // 拉最小宽度
  if (pressed.value && minSpace.status && x.value < widthControl.end && _x.last> x.value) {
    asiderWidth.width = widthControl.start - divLeft.value + 'px'
    separatorStyle.left = widthControl.start + 'px'
    minSpace.status = false
  }

  // 当鼠标水平运动小于某个大小 且满足进入最小空间 需要按住鼠标
  if (pressed.value && minSpace.isActive && x.value <= widthControl.end && !minSpace.status) {
    asiderWidth.width = widthControl.min - divLeft.value + 'px'
    separatorStyle.left = widthControl.min + 'px'
    divWidth.value = widthControl.min
    minSpace.isActive = false
    minSpace.status = true
  }

  // 获取上次运动的x值
  _x.last = x.value
})

// 可以用定位 但是left调不动
watch(isOutside, () => {
  // 当进入拉伸区域 修改为激活
  isActive.value = !isOutside.value ? true : isActive.value
  // 当鼠标经过时候拉伸栏时候延迟变宽
  if (!pressed.value) {
    useTimeoutFn(() => {
      separatorStyle.left = isOutside.value ?
        right.value - widthControl.sepWidth / 2 + 'px' : right.value - widthControl.sepBoldWidth / 2 + 'px'
      separatorStyle.width = isOutside.value
        ? widthControl.sepWidth + 'px' : widthControl.sepBoldWidth + 'px'
      document.body.style.cursor = !isOutside.value ? 'col-resize' : 'default'
    }, 50)
  }
})

// 监听鼠标是否触发点击
watch(pressed, () => {
  // 当鼠标放开 修改为失效
  isActive.value = !pressed.value ? false : isActive.value
  // 获取开始点击位置
  _x.start = x.value
  // 如果在拉伸区域 且鼠标触发点击状态切换【监听是否松开】
  if (!pressed.value) {
    document.body.style.cursor = 'default'
  }
  if (!pressed.value && !isOutside.value) {
    // 存储当前位置
    useStorage('asider-width', divWidth.value)
  }
})
</script>

<style scoped>

</style>
