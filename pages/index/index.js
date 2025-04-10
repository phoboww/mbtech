Page({
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    // 加载店铺头图
    const shopBanner = wx.getStorageSync('shopBanner')
    if (shopBanner) {
      this.setData({ shopBanner })
    }
    // 加载背景图
    const backgroundImage = wx.getStorageSync('menuBackgroundImage')
    if (backgroundImage) {
      this.setData({ backgroundImage })
    }
    this.loadCategories()
    this.loadOrderItems()
  },
  onShow() {
    this.loadCategories()
  },
  loadCategories() {
    const categories = wx.getStorageSync('categories') || []
    this.setData({ 
      categories,
      currentDishes: categories[this.data.currentCategory]?.dishes || []
    })
  },
  switchCategory(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentCategory: index,
      currentDishes: this.data.categories[index].dishes || []
    })
  },
  addCategory() {
    wx.showModal({
      title: '添加分类',
      editable: true,
      placeholderText: '请输入分类名称',
      success: (res) => {
        if (res.confirm && res.content) {
          const categories = this.data.categories
          categories.push({
            name: res.content,
            dishes: []
          })
          this.setData({ categories })
          wx.setStorage({
            key: 'categories',
            data: categories
          })
        }
      }
    })
  },
  deleteCategory(e) {
    const index = e.currentTarget.dataset.index
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个分类吗？',
      success: (res) => {
        if (res.confirm) {
          const categories = this.data.categories
          categories.splice(index, 1)
          this.setData({ 
            categories,
            currentCategory: 0,
            currentDishes: categories[0]?.dishes || []
          })
          wx.setStorage({
            key: 'categories',
            data: categories
          })
        }
      }
    })
  },
  onAddDish(e) {
    const categoryIndex = e.currentTarget.dataset.categoryIndex
    wx.navigateTo({
      url: `/pages/dish/add/add?categoryIndex=${categoryIndex}`,
      fail: (err) => {
        console.error('页面跳转失败:', err)
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  },
  addToCart(e) {
    const dish = e.currentTarget.dataset.dish
    const cartItems = wx.getStorageSync('cartItems') || []
    const existingItem = cartItems.find(item => item.id === dish.id)
    
    if (existingItem) {
      existingItem.count++
    } else {
      cartItems.push({
        ...dish,
        count: 1
      })
    }
    
    wx.setStorageSync('cartItems', cartItems)
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },
  deleteDish(e) {
    const dishId = e.currentTarget.dataset.dishId
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个菜品吗？',
      success: (res) => {
        if (res.confirm) {
          const categories = this.data.categories
          const category = categories[this.data.currentCategory]
          category.dishes = category.dishes.filter(dish => dish.id !== dishId)
          
          this.setData({
            categories,
            currentDishes: category.dishes
          })
          
          wx.setStorage({
            key: 'categories',
            data: categories
          })
        }
      }
    })
  },
  uploadBackground() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          backgroundImage: tempFilePath
        })
        wx.setStorageSync('menuBackgroundImage', tempFilePath)
      }
    })
  },
  uploadShopBanner() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          shopBanner: tempFilePath
        })
        wx.setStorageSync('shopBanner', tempFilePath)
      }
    })
  },
  // 搜索输入
  onSearchInput(e) {
    const value = e.detail.value.trim();  // 去除空格
    this.setData({ 
        searchValue: value // 更新输入框的值
    });
    
    // 根据输入框的内容设置清除按钮的显示状态
    this.setData({
        showClearButton: value.length > 0 // 如果输入框有内容，则显示清除按钮
    });

    if (!value) {
      this.setData({ 
        searchResults: [],
        showClearButton: false // 隐藏清空按钮
      });
      return;
    }

    // 搜索所有分类中的菜品
    const results = [];
    this.data.categories.forEach((category, categoryIndex) => {
      category.dishes?.forEach(dish => {
        // 使用模糊匹配，不区分大小写
        if (dish.name.toLowerCase().includes(value.toLowerCase())) {
          results.push({
            ...dish,
            categoryIndex
          });
        }
      });
    });

    // 限制显示数量，优化性能
    this.setData({ 
      searchResults: results.slice(0, 10)  // 最多显示10条结果
    });

    console.log('搜索值:', value);
    console.log('搜索结果:', results);
  },

  clearSearch() {
    console.log('清除输入'); // 调试输出
    this.setData({
        searchValue: '', // 清空输入框
        searchResults: [], // 清空搜索结果
        showClearButton: false // 隐藏清空按钮
    });
  },

  showReviews() {
    this.setData({
      showReviewsList: true,
      reviews: [
        {
          id: 1,
          avatar: '/images/default-avatar.png',
          nickname: '匿名用户',
          rating: 5,
          content: '菜品非常新鲜美味，服务态度很好！',
          date: '2024-03-15'
        },
        {
          id: 2,
          avatar: '/images/default-avatar.png',
          nickname: '匿名用户',
          rating: 5,
          content: '环境很好，上菜速度快，味道赞！',
          date: '2024-03-14'
        },
        {
          id: 3,
          avatar: '/images/default-avatar.png',
          nickname: '匿名用户',
          rating: 5,
          content: '价格实惠，分量足，会再来！',
          date: '2024-03-13'
        },
        {
          id: 4,
          avatar: '/images/default-avatar.png',
          nickname: '匿名用户',
          rating: 5,
          content: '店家很贴心，餐具很干净！',
          date: '2024-03-12'
        }
      ]
    })
  },
  hideReviews() {
    this.setData({
      showReviewsList: false
    })
  },
  loadOrderItems() {
    // 假设从某个 API 或本地存储中获取菜品数据
    const orderItems = [
      { id: 1, name: '卡布奇诺', price: 2, image: 'path/to/image1.jpg' },
      { id: 2, name: '美式', price: 3, image: 'path/to/image2.jpg' }
      // 添加更多菜品
    ];
    this.setData({ orderItems });
  }
})
