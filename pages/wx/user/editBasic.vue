<template>
  <div class="user-edit-container">
    <div class="user-header bm-box bm-box-horizontal bm-box-vertical-center">
      <div @click="doBack" class="header-left">
        <i class="iconfont icon-back"></i>
      </div>
      <div class="bm-flex header-title">个人中心</div>
      <div class="header-right"></div>
    </div>
    <div class="user-edit-basicInfo">
      <!--<p>{{usert}}</p>-->
      <div class="header-pic">
        <img v-if="!avatarUrl" src='../../../assets/images/center_common/head_portrait.png'>
        <!-- <file-upload
          ref="upload" 
          v-model="files"
          post-action="http://dev.app.event.ftms.devwox.com:8080/member/api/uploadMemberLogo"
          @input-file="inputFile"
        ></file-upload> -->
  <el-upload
  class="avatar-uploader"
  action="http://dev.app.event.ftms.devwox.com:8080/member/api/uploadMemberLogo"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="avatarUrl" :src="avatarUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
      </div>
      <div class="edit-basic-info">
        <span>用户名:</span>&nbsp;&nbsp;
        <span class="info-detail">{{usert.loginName.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
      </div>
      <div class="edit-basic-info">
        <span>手机号:</span>&nbsp;&nbsp;
        <span class="info-detail">{{usert.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}}</span>
      </div>
      <div class="edit-basic-info">
        <span>真实姓名:</span>
        <input
          type="text"
          v-model="usert.Real_name"
          :disabled="!enableReset"
          placeholder="请输入真实姓名"
          ref="userRealName"
        >
      </div>
      <div class="edit-basic-info">
        <span>身份证号:</span>
        <input
          type="text"
          v-model="usert.idCard1"
          @blur="getFromIdCard"
          :disabled="!enableReset"
          placeholder="请输入身份证号"
          ref="idCard"
        >
      </div>
      <div class="edit-basic-info">
        <span>生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日:</span>
        <input type="date" v-model="usert.birthday" disabled placeholder="生日">
      </div>
      <div class="edit-basic-info">
        <span>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</span>
        <input
          id="sex0"
          type="radio"
          value="1"
          :checked="ifchecked(usert.sex,'1')"
          name="sex"
          disabled
        >
        <span>男</span>
        <input
          id="sex1"
          type="radio"
          value="2"
          :checked="ifchecked(usert.sex,'2')"
          name="sex"
          disabled
        >
        <span>女</span>
      </div>
      <div class="edit-btn">
        <span @click="saveEdit">
          <div class="search-btn">
            <i class="iconfont icon-save"></i>
          </div>保存
        </span>
        <span @click="Restructure">
          <div class="search-btn">
            <i class="iconfont icon-reset"></i>
          </div>重置
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Request from '~/plugins/request'
import FileUpload from 'vue-upload-component/dist/vue-upload-component.part.js'
// import commonSelect from '~/components/common/layer/common-select.vue'
// import termsService from '~/components/common/layer/terms-service.vue'
// export default {
// name: 'edit',
// components: {

export default {
  components: {
    FileUpload
  },
  data() {
    const basePath = process.env.server
    const mainUrl = basePath.mainUrl
    return {
      usert: {
        loginName: '',
        mobile: '',
        birthday: '',
        sex: '',
        Real_name: '',
        idCard: ''
      },
      imageUrl: '',
      enableReset: false,
      avatarUrl: '',
      files: [],
      mainUrl: '',
      uploadUrl: `${mainUrl}/member/api/uploadMemberLogo`
    }
  },
  mounted() {
    // const basePath = process.env.server
    // const mainUrl = basePath.mainUrl
    let t = this
    // t.mainUrl = mainUrl
    // t.uploadUrl = mainUrl + t.uploadUrl
    if (!t.userObj.logined) {
      // 获取登录信息
      let userObj = t.$common.getUserInfo() || ''
      if (userObj === '') {
        userObj = t.$common.getUnLoginData()
      }
      if (!userObj.logined) {
        // 未登录
        t.$common.clearUserInfo()
        t.$messageBox.confirm('登录失效，是否重新登录?').then(
          action => {
            t.syncLoadLayer({
              type: 'login',
              show: true
            })
          },
          cancel => {
            t.$common.clearUserInfo()
            t.$router.replace('/wx')
          }
        )
      };

      // 异步调用
      (async () => {
        try {
          await t.$store.dispatch('doLogin', userObj)
          t.$store.dispatch('getUserInfo', t.userObj.data)
          t.usert.loginName = t.userObj.data.loginName
          t.usert.mobile = t.userObj.data.mobile
          t.usert.birthday = t.userObj.data.birthday
          t.usert.sex = t.userObj.data.sex
          t.usert.Real_name = t.userObj.data.realName
          t.usert.idCard = t.userObj.data.idCard
          t.enableReset = !t.usert.Real_name || !t.usert.idCard
          t.avatarUrl = t.userObj.data.memberLogo
          t.getFromIdCard()
        } catch (error) {
          console.log(error)
        }
      })()
    } else {
      // if (t.userObj.data.idCard !== '') {
      //   t.getFromIdCard()
      // } else {
      // }
      (async () => {
        try {
          await t.$store.dispatch('getUserInfo', t.userObj.data)
          t.usert.loginName = t.userObj.data.loginName
          t.usert.mobile = t.userObj.data.mobile
          t.usert.birthday = t.userObj.data.birthday
          t.usert.sex = t.userObj.data.sex
          t.usert.Real_name = t.userObj.data.realName
          t.usert.idCard = t.userObj.data.idCard
          t.usert.idCard1 = t.userObj.data.idCard.replace(/^(.{4})(?:\d+)(.{4})$/, '$1**********$2')
          t.enableReset = !t.usert.Real_name || !t.usert.idCard
          t.avatarUrl = t.userObj.data.memberLogo
          if (t.userObj.data.idCard) {
            t.getFromIdCard()
          }
        } catch (error) {
          console.log(error)
        }
      })()
    }

    setTimeout(() => {
      t.$util.win.goTop() // 回到顶部
      // if (t.$refs.idCard) {
      //   t.$refs.idCard.focus()
      // }
      if (t.$refs.userRealName) {
        t.$refs.userRealName.focus()
      }
    }, 400)
  },
  computed: {
    ...mapState({
      // 映射
      userObj: state => state.user.user
    })
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.avatarUrl = file.response.data.imgNetworkAddress
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    },
    doBack() {
      this.$router.push('/wx/user')
    },
    ifchecked(sex, v) {
      return sex === v
    },
    saveEdit() {
      let t = this
      // console.log(t.enableReset, !t.avatarUrl, t.usert.idCard1)
      Request.updateMemberInfo({
        ACCESS_TOKEN: t.$store.state.user.user.data.token,
        idCard: t.enableReset ? t.usert.idCard1 : t.usert.idCard, // 身份证号码
        realName: t.usert.Real_name, // 真实姓名
        memberLogo: t.avatarUrl
      }).then(result => {
        if (result.success) {
          t.$toast('修改用户信息成功')
          let loginObj = {
            logined: true,
            data: {
              loginName: t.usert.loginName || '',
              memberId: t.usert.memberId || '',
              mobile: t.usert.mobile || '',
              token: t.$store.state.user.user.data.token,
              realName: t.usert.Real_name || '',
              idCard: t.usert.idCard1 || '',
              memberLogo: t.avatarUrl
            }
          }
          t.$store.dispatch('user/USER_GET_DATA', loginObj) // 存储用户信息
          t.$router.push('/wx/user')
        } else {
          t.$toast(result.msg)
        }
      })
    },
    getFromIdCard() {
      // 验证身份证11
      let idCard = ''
      if (this.usert.idCard !== '') {
        idCard = this.usert.idCard
      } else {
        idCard = this.usert.idCard1
      }
      console.log('1111111', idCard)
      const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx])|([1−9]\d5\d2((0[1−9])|(10|11|12))(([0−2][1−9])|10|20|30|31)\d2[0−9Xx])/
      if (idCard !== '') {
        if (!reg.test(idCard)) {
          this.$toast('请输入正确的身份证号码')
        } else {
          // 获取出生日期
          const birth = idCard.substring(6, 10) + '-' + idCard.substring(10, 12) + '-' + idCard.substring(12, 14)
          let sex = '1'
          // 获取性别
          if (parseInt(idCard.substr(16, 1)) % 2 === 1) {
            // 男
            sex = '1'
          } else {
            // 女
            sex = '2'
          }
          console.log(sex)
          this.usert.birthday = birth
          this.usert.sex = sex
        }
      }
    },
    sexx(v) {
      // this.usert.sex = v
    },
    Restructure() {
      if (this.enableReset) {
        let t = this
        t.usert.idCard = ''
        t.usert.Real_name = ''
      }
    },
    inputFile(newFile, oldFile) {
      const t = this
      if (newFile && !oldFile) {
        // 添加文件
      }

      if (newFile && oldFile) {
        // 更新文件

        // 开始上传
        if (newFile.active !== oldFile.active) {
          console.log('Start upload', newFile.active, newFile)

          // 限定最小字节5M
          if (newFile.size > 5 * 1000 * 1024) {
            newFile = this.$refs.upload.update(newFile, { error: 'size' })
          }
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }

        // 上传错误
        if (newFile.error !== oldFile.error) {
          console.log('error', newFile.error, newFile)
        }

        // 上传成功
        if (newFile.success !== oldFile.success) {
          console.log('response', newFile.response)
          if (newFile.response) {
            t.avatarUrl = newFile.response.data.imgNetworkAddress
          }
        }
      }

      if (!newFile && oldFile) {
        // 删除文件

        // 自动删除 服务器上的文件
        if (oldFile.success && oldFile.response.id) {
          // $.ajax({
          //   type: 'DELETE',
          //   url: '/file/delete?id=' + oldFile.response.id,
          // });
        }
      }

      // 自动上传
      if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
        if (!this.$refs.upload.active) {
          this.$refs.upload.active = true
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/sass/pages/user/editBasic.scss";
</style>
