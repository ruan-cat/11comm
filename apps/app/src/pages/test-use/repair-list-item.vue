<!--
  repair-list-item 组件演示页
  功能：演示 repair-list-item 组件的各种用法和效果

  访问地址: http://localhost:3000/#/pages/test-use/repair-list-item
-->

<script setup lang="ts">
import { ref } from 'vue'
import FormSectionTitle from '@/components/common/form-section-title/index.vue'
import RepairListItem from '@/components/common/repair-list-item/index.vue'

definePage({
  style: {
    navigationBarTitleText: 'repair-list-item 组件演示',
  },
})

// 模拟数据
const mockItem1 = ref({
  repairId: '202310270001',
  title: '洗手池漏水维修',
  statusCd: '10001',
  statusName: '待派单',
  repairTypeName: '公共区域维修',
  repairName: '张三',
  tel: '13800138000',
  address: '1号楼1单元101',
  createTime: '2023-10-27 10:00:00',
  context: '洗手池水管破裂，一直在漏水，需要紧急处理。',
})

const mockItem2 = ref({
  repairId: '202310270002',
  title: '路灯故障',
  statusCd: '10002',
  statusName: '处理中',
  repairTypeName: '设施设备',
  repairName: '李四',
  tel: '13900139000',
  address: '小区主干道',
  appointmentTime: '2023-10-28 14:00:00',
  context: '路灯不亮了。',
})
</script>

<template>
  <wd-navbar title="列表项演示" placeholder fixed />

  <view class="page-container">
    <FormSectionTitle title="基础用法" />
    <repair-list-item :item="mockItem1">
      <template #action>
        <wd-button size="small" plain>
          详情
        </wd-button>
        <wd-button size="small" type="primary">
          派单
        </wd-button>
      </template>
    </repair-list-item>

    <FormSectionTitle title="复杂状态" />
    <repair-list-item :item="mockItem2">
      <template #action>
        <wd-button size="small" plain>
          详情
        </wd-button>
        <wd-button size="small" type="warning">
          暂停
        </wd-button>
        <wd-button size="small" type="success">
          办结
        </wd-button>
      </template>
    </repair-list-item>
  </view>
</template>

<style scoped>
.page-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
