/**
 * 员工通讯录逻辑封装
 * 将员工通讯录页面的复杂逻辑抽离为可复用的 composable
 * 实现了完整的员工通讯录业务逻辑，包括搜索、索引、交互等功能
 */

import type { IndexBarPosition, IndexTouchEvent, Staff, StaffGroup } from '@/types/staff'
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { useRequest } from 'alova/client'
import { computed, nextTick, ref, watch } from 'vue'
import { formatStaffList, queryStaffList } from '@/api/staff'
import { useGlobalToast } from '@/hooks/useGlobalToast'

interface UseAddressListOptions {
  storeId?: string
  immediate?: boolean
  autoInitialize?: boolean
}

interface UserInfo {
  storeId: string
  userName?: string
}

export function useAddressList(options: UseAddressListOptions = {}) {
  const { storeId = 'store_001', immediate = true, autoInitialize = true } = options

  // ==================== 状态管理 ====================

  // 基础状态
  const list = ref<StaffGroup[]>([])
  const searchKeyword = ref('')
  const hidden = ref(true)
  const listCurID = ref('')
  const listCur = ref('')

  // 索引栏位置信息
  const indexBarPosition = ref<IndexBarPosition>({
    boxTop: 0,
    barTop: 0,
  })

  // 导航栏高度
  const CustomBar = ref(0)

  // 用户信息（集成社区用户服务）
  const userInfo = ref<UserInfo>({
    storeId,
    userName: '用户',
  })

  // 模拟用户服务（未来可替换为真实的用户服务）
  const userService = {
    getCurrentStoreId: () => userInfo.value.storeId,
    getUserInfo: () => ({ userName: userInfo.value.userName }),
    initUserSession: () => {
      // 初始化用户会话逻辑
      console.log('用户会话已初始化')
    },
  }

  // ==================== 请求管理 ====================

  // 员工列表请求
  const {
    loading: staffLoading,
    data: staffData,
    send: loadStaffInfo,
    error: staffError,
  } = useRequest(
    () =>
      queryStaffList({
        page: 1,
        row: 1000,
        storeId: userInfo.value.storeId,
        name: searchKeyword.value,
      }),
    {
      immediate: false,
    },
  )

  // ==================== 业务逻辑方法 ====================

  /**
   * 格式化员工列表数据
   * 使用 API 中的 formatStaffList 函数，保持与页面一致
   */
  const formatList = (staffs: Staff[], keyword: keyof Staff = 'initials'): StaffGroup[] => {
    return formatStaffList(staffs, keyword)
  }

  /**
   * 拨打电话
   */
  const callPhone = (phone: string) => {
    const toast = useGlobalToast()
    if (!phone) {
      toast.warning('电话号码不存在')
      return
    }

    uni.makePhoneCall({
      phoneNumber: phone,
      success: () => {
        console.log('拨打成功')
      },
      fail: (error) => {
        console.error('拨打失败:', error)
        toast.error('拨打失败')
      },
    })
  }

  /**
   * 搜索员工
   */
  const searchStaff = () => {
    const toast = useGlobalToast()
    if (!searchKeyword.value.trim()) {
      toast.warning('请输入搜索关键词')
      return
    }
    loadStaffInfo()
  }

  /**
   * 清空搜索
   */
  const clearSearch = () => {
    searchKeyword.value = ''
    loadStaffInfo()
  }

  // ==================== 字母索引交互方法 ====================

  /**
   * 获取当前选中的字母
   */
  const getCur = (e: IndexTouchEvent) => {
    hidden.value = false
    const targetId = e.target?.id
    if (targetId !== undefined && list.value[targetId]) {
      listCur.value = list.value[targetId].initials
    }
  }

  /**
   * 设置当前字母（隐藏提示）
   */
  const setCur = () => {
    hidden.value = true
  }

  /**
   * 索引栏触摸移动
   */
  const tMove = (e: IndexTouchEvent) => {
    if (!e.touches?.length)
      return

    const y = e.touches[0].clientY
    const { boxTop } = indexBarPosition.value

    if (y > boxTop) {
      const itemHeight = 20
      const index = Math.floor((y - boxTop) / itemHeight)

      if (index >= 0 && index < list.value.length) {
        listCur.value = list.value[index].initials
      }
    }
  }

  /**
   * 开始触摸索引栏
   */
  const tStart = () => {
    hidden.value = false
  }

  /**
   * 结束触摸索引栏
   */
  const tEnd = () => {
    hidden.value = true
    listCurID.value = listCur.value
  }

  /**
   * 处理员工数据加载完成
   */
  const handleStaffDataLoaded = () => {
    if (staffData.value?.staffs) {
      list.value = formatList(staffData.value.staffs)
      listCur.value = list.value[0]?.initials || ''
    }
  }

  /**
   * 错误处理
   */
  const handleError = (error: any) => {
    const toast = useGlobalToast()
    console.error('员工数据加载失败:', error)
    toast.error('加载失败，请重试')
  }

  // ==================== 计算属性 ====================

  // 计算加载状态
  const isLoading = computed(() => staffLoading.value)

  // 空状态判断
  const isEmpty = computed(() => list.value.length === 0 && !isLoading.value)

  // 搜索状态
  const isSearching = computed(() => !!searchKeyword.value.trim())

  // 总员工数
  const totalStaffCount = computed(() => {
    return list.value.reduce((total, group) => total + group.staffs.length, 0)
  })

  // 在线员工数
  const onlineStaffCount = computed(() => {
    return list.value.reduce((total, group) => {
      return total + group.staffs.filter(staff => staff.isOnline).length
    }, 0)
  })

  // ==================== 生命周期钩子 ====================

  const initCustomBar = () => {
    try {
      const systemInfo = uni.getSystemInfoSync()

      // #ifdef H5
      CustomBar.value = 44
      // #endif

      // #ifdef MP-WEIXIN
      CustomBar.value = systemInfo.statusBarHeight + 44
      // #endif

      // #ifndef H5
      CustomBar.value = systemInfo.statusBarHeight + 44
      // #endif
    }
    catch (error) {
      CustomBar.value = 64 // 默认值
    }
  }

  const initIndexBarPosition = () => {
    const query = uni.createSelectorQuery()

    query
      .select('.indexBar-box')
      .boundingClientRect((res) => {
        if (res && !Array.isArray(res)) {
          indexBarPosition.value.boxTop = res.top || 0
        }
      })
      .exec()

    query
      .select('.indexes')
      .boundingClientRect((res) => {
        if (res && !Array.isArray(res)) {
          indexBarPosition.value.barTop = res.top || 0
        }
      })
      .exec()
  }

  const onPullDownRefreshHandler = async () => {
    await loadStaffInfo()
    uni.stopPullDownRefresh()
  }

  // ==================== 数据监听 ====================

  // 监听员工数据变化
  watch(
    [staffData, staffError],
    ([newData], [oldData]) => {
      if (newData !== oldData) {
        handleStaffDataLoaded()
      }

      if (staffError.value) {
        handleError(staffError.value)
      }
    },
    { immediate: true },
  )

  // ==================== 自动初始化 ====================

  const initialize = () => {
    if (autoInitialize) {
      // 初始化用户会话
      userService.initUserSession()

      // 初始化导航栏高度
      initCustomBar()

      // 加载员工数据
      if (immediate) {
        loadStaffInfo()
      }

      // 延迟初始化索引栏位置
      nextTick(() => {
        setTimeout(() => {
          initIndexBarPosition()
        }, 100)
      })
    }
  }

  // 页面加载时自动初始化
  if (autoInitialize) {
    onLoad(() => {
      initialize()
    })

    // 注册下拉刷新处理
    onPullDownRefresh(onPullDownRefreshHandler)
  }

  // ==================== 暴露的方法和状态 ====================

  const refresh = async () => {
    await loadStaffInfo()
  }

  const reset = () => {
    searchKeyword.value = ''
    loadStaffInfo()
  }

  return {
    // 状态
    list,
    searchKeyword,
    hidden,
    listCurID,
    listCur,
    isLoading,
    isEmpty,
    isSearching,
    CustomBar,
    totalStaffCount,
    onlineStaffCount,
    staffError,
    userInfo,

    // 用户服务
    userService,

    // 方法
    loadStaffInfo,
    callPhone,
    searchStaff,
    clearSearch,
    refresh,
    reset,
    initialize,

    // 索引交互方法
    getCur,
    setCur,
    tMove,
    tStart,
    tEnd,

    // 生命周期方法
    initCustomBar,
    initIndexBarPosition,
    onPullDownRefreshHandler,

    // 内部方法（主要用于测试）
    formatList,
    handleStaffDataLoaded,
    handleError,
  }
}
