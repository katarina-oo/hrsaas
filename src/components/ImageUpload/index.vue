<template>
  <div>
    <!--
      action 指定上传的地址
      limit 限制上传文件的数量
      file-list 上传的文件列表
      before-upload 钩子函数 -> 返回 false 或者返回 Promise 且被 reject，则停止上传
      http-request 覆盖默认的上传行为，可以自定义上传的实现
    -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus avatar-uploader-icon" />
    </el-upload>

    <!-- 图片上传的进度条 -->
    <el-progress v-if="showPercent" :percentage="percent" style="width: 200px" />

    <!-- 放置一个弹层 -->
    <!-- sync修饰符自动将弹层关闭了 -->
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 1.引入腾讯云 cos 包
// 2. 实例化 COS 对象
const cos = new COS({
  SecretId: 'AKIDrXw5xYsvhCQO5VdU5JHyPZS4QUHn1zg6',
  SecretKey: 'A3f17xWooX0C7l9F4cuvf8KFtHNDm45p'
})
export default {
  data() {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: null, // 用一个变量 记录当前正在上传的uid
      percent: 0, // 记录当前上传图片的进度条的百分比
      showPercent: false
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张 为 true 不显示图片上传的 +
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件 -> 调用 on-preview 钩子 实现预览
    preview(file) {
      // console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file 要删除的文件
    // fileList 删除过之后的文件
    handleRemove(file, fileList) {
      // console.log(file)
      // console.log(fileList)
      // console.log(this.fileList)

      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      // 或用
      // this.fileList = fileList
    },
    // 不可使用 push 这个钩子函数 会执行多次
    // file 当前的文件
    // fileList 是当前的最新数组
    changeFile(file, fileList) {
      // console.log(11)
      // console.log(file)
      console.log(fileList.length)
      // console.log(this.fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      console.log(file)
      // 先检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      // 上传的图片如果不存在 file.type 的图片类型 -> 终止上传
      // if(!type.includes(file.type)){ // 使用 includes 也可
      if (!types.some(item => item === file.type)) {
        this.$message.succses('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false // before-upload 钩子函数就会终止上传
      }
      // 文件类型通过后 检查文件大小 5M 1M = 1024KB , 1KB = 1024B
      const maxSize = 5 * 1024 * 1024 // 定义最大的文件大小
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
        // return Promise.reject() // 等价于 return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true // 最后还需 return true 确保可以上传
    },
    // 进行上传操作
    upload(params) {
      // console.log(params)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'hrsaas-1312845490', // 存储桶 名称
          Region: 'ap-nanjing', // 存储桶所在地域
          Key: params.file.name, // 存储在桶里的对象键(文件名)
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认
          Body: params.file, // 要上传的文件对象
          onProgress: (params) => {
            // console.log(params) //  -> 有个参数 percent 0~1
            this.percent = params.percent * 100
          }
        }, (error, data) => {
          // 正常上传到腾讯云成功之后：data
          // ETag 表示标记的意思
          // Location 表示当前你上传的图片所在桶里的位置
          // statusCode 上传之后返回的状态码

          // console.log(error || data)
          // data 中有一个 statusCode === 200 的时候说明上传成功
          if (!error && data.statusCode === 200) {
            // 上传成功，获取成的返回地址
            // fileList 才能显示到上传组件上，要将 fileList 中的数据url地址 变成 现在上传成功的地址
            this.fileList = this.fileList.map(item => {
              // 去找 谁的 uid 等于刚刚记录下来的 id
              if (item.uid === this.currentFileUid) {
                // 将成功的 地址赋值给原来的 url 属性
                // upload: true 表示该图片已经上传完毕，添加该属性是为后期应用时做标记（上传图有快有慢，可以根据这个标记决定是否 保存）
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            // 上方代码 -> 将上传成功的地址 回显 到了 fileList 中

            // 上传成功后 关闭上传图片的进度条、重置百分比
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 1000) // 延迟 1秒 看效果
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
