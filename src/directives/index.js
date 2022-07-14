// 负责管理所有的 自定义指令

export const imageerror = {
  // 指令对象
  // inserted() 钩子函数 -> 在当前的DOM元素插入到节点之后执行
  inserted(dom, options) {
    // options 是指令中的变量的解释，有一个属性叫：value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    // 当图片有地址，但地址没有加载成功时 会报错，会触发图片一个事件 -> onerror
    dom.onerror = function() {
      // dom可以注册 onerror 事件
      // dom.src = '默认图片' (但不能写死)
      // 当图片出现异常时，会将指令配置的默认图片设置为该图片的内容
      dom.src = options.value
    }
  }
}
