<script lang="ts" setup>
definePage({
	meta: {
		title: "业主信息",
		icon: "f7:menu",
	},
});
import { ref } from 'vue';
import { User } from '@element-plus/icons-vue';
import { transformI18n } from "@/plugins/i18n";
// 定义业主信息接口
interface OwnerInfo {
  业主ID: string;
  姓名: string;
  性别: string;
  年龄: number;
  身份证: string;
  联系方式: string;
  创建员工: string;
  备注: string;
}

// 定义房屋信息接口
interface HouseInfo {
  房屋编号: string;
  楼层: string;
  房屋ID: string;
  建筑面积: string;
  户型: string;
  房间数: number;
}

// 业主信息数据
const ownerInfo = ref<OwnerInfo>({
  业主ID: "772025069220527791",
  姓名: "张三",
  性别: "男",
  年龄: 0,
  身份证: "wuwu",
  联系方式: "19292929292",
  创建员工: "",
  备注: "",
});

// 房屋信息列表
const houseList = ref<HouseInfo[]>([
  {
    房屋编号: "999999.1-101",
    楼层: "1楼",
    房屋ID: "752025069226020989",
    建筑面积: "120.00 平方米",
    户型: "10102",
    房间数: 0,
  },
  {
    房屋编号: "111-1-1109",
    楼层: "11楼",
    房屋ID: "752025069566120767",
    建筑面积: "223.00 平方米",
    户型: "10102",
    房间数: 1,
  },
]);

// 处理我要迁出按钮点击
const handleCheckOut = (house: HouseInfo) => {
  console.log("迁出房屋:", house);
  // 这里可以添加迁出逻辑
  // ElMessage.info(`您正在迁出房屋: ${house.房屋编号}`);
	alert(`您正在迁出房屋: ${house.房屋编号}`);
};
</script>


<template>
  <div class="check-out-page">
    <!-- 业主信息卡片 -->
    <el-card class="owner-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">业主信息</span>
          <el-button type="primary" size="small">编辑</el-button>
        </div>
      </template>
      
      <div class="owner-info">
        <div class="avatar-section">
          <el-avatar :size="80" class="owner-avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>
        
        <div class="info-section">
          <div class="info-row">
            <div class="info-item">
              <span class="label">业主ID:</span>
              <span class="value">{{ ownerInfo.业主ID }}</span>
            </div>
            <div class="info-item">
              <span class="label">姓名:</span>
              <span class="value">{{ ownerInfo.姓名 }}</span>
            </div>
            <div class="info-item">
              <span class="label">性别:</span>
              <span class="value">{{ ownerInfo.性别 }}</span>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-item">
              <span class="label">年龄:</span>
              <span class="value">{{ ownerInfo.年龄 }}</span>
            </div>
            <div class="info-item">
              <span class="label">身份证:</span>
              <span class="value">{{ ownerInfo.身份证 }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系方式:</span>
              <span class="value">{{ ownerInfo.联系方式 }}</span>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-item">
              <span class="label">创建员工:</span>
              <span class="value">{{ ownerInfo.创建员工 || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="label">备注:</span>
              <span class="value">{{ ownerInfo.备注 || '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 房屋信息列表 -->
    <div class="house-list">
      <el-card 
        v-for="(house, index) in houseList" 
        :key="house.房屋ID" 
        class="house-card" 
        shadow="hover"
      >
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ index === 0 ? '101房屋 信息' : '1109房屋 信息' }}</span>
            <el-button 
              type="primary" 
              size="small"
              @click="handleCheckOut(house)"
            >
              <i class="fa fa-sign-out"></i> 我要迁出
            </el-button>
          </div>
        </template>
        
        <div class="house-info">
          <div class="info-row">
            <div class="info-item">
              <span class="label">房屋编号:</span>
              <span class="value">{{ house.房屋编号 }}</span>
            </div>
            <div class="info-item">
              <span class="label">楼层:</span>
              <span class="value">{{ house.楼层 }}</span>
            </div>
            <div class="info-item">
              <span class="label">房屋ID:</span>
              <span class="value">{{ house.房屋ID }}</span>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-item">
              <span class="label">建筑面积:</span>
              <span class="value">{{ house.建筑面积 }}</span>
            </div>
            <div class="info-item">
              <span class="label">户型:</span>
              <span class="value">{{ house.户型 }}</span>
            </div>
            <div class="info-item">
              <span class="label">房间数:</span>
              <span class="value">{{ house.房间数 }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --primary-color: #409eff;
  --primary-light: #e6f7ff;
  --text-color: #303133;
  --text-secondary: #606266;
  --bg-color: #f5f7fa;
  --card-bg: #ffffff;
  --border-color: #dcdfe6;
}

.check-out-page {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--bg-color);
}

.owner-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    
    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
    }
  }
}

.owner-info {
  display: flex;
  gap: 30px;
  
  .avatar-section {
    flex-shrink: 0;
    
    .owner-avatar {
      background-color: var(--primary-light);
      color: var(--primary-color);
      border: 3px solid var(--primary-color);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
    }
  }
  
  .info-section {
    flex: 1;
    
    .info-row {
      display: flex;
      gap: 30px;
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .info-item {
        display: flex;
        flex-direction: column;
        min-width: 220px;
        
        .label {
          color: var(--text-secondary);
          font-size: 14px;
          margin-bottom: 6px;
          font-weight: 500;
        }
        
        .value {
          color: var(--text-color);
          font-size: 16px;
          font-weight: 600;
          word-break: break-all;
        }
      }
    }
  }
}

.house-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.house-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(64, 158, 255, 0.15);
    border-color: var(--primary-color);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
    
    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
    }
  }
}

.house-info {
  .info-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      min-width: 180px;
      
      .label {
        color: var(--text-secondary);
        font-size: 14px;
        margin-bottom: 6px;
        font-weight: 500;
      }
      
      .value {
        color: var(--text-color);
        font-size: 16px;
        font-weight: 600;
        word-break: break-all;
      }
    }
  }
}

// 响应式设计
@media (max-width: 992px) {
  .owner-info {
    flex-direction: column;
    align-items: center;
  }
  
  .info-section, .info-row {
    width: 100%;
  }
  
  .info-row {
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .info-item {
    min-width: calc(50% - 10px);
  }
}

@media (max-width: 768px) {
  .check-out-page {
    padding: 20px 15px;
  }
  
  .owner-card, .house-card {
    padding: 20px 15px;
  }
  
  .info-item {
    min-width: 100%;
  }
}
</style>
