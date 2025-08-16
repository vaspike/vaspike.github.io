// 全局状态
let currentUser = null;
let selectedDate = null;
let selectedPeriod = null;
let pollInterval = null;

// API 配置
const API_BASE = 'https://coffee.rivermao.com:8443/api'; // 替换为实际服务器地址

// DOM 元素
const elements = {
    userPage: document.getElementById('userPage'),
    datePage: document.getElementById('datePage'),
    orderPage: document.getElementById('orderPage'),
    username: document.getElementById('username'),
    currentUsername: document.getElementById('currentUsername'),
    orderDate: document.getElementById('orderDate'),
    sessionDate: document.getElementById('sessionDate'),
    sessionPeriod: document.getElementById('sessionPeriod'),
    coffeeType: document.getElementById('coffeeType'),
    remark: document.getElementById('remark'),
    ordersList: document.getElementById('ordersList'),
    totalCount: document.getElementById('totalCount'),
    loading: document.getElementById('loading'),
    toast: document.getElementById('toast')
};

// 工具函数
function showLoading() {
    elements.loading.classList.remove('hidden');
}

function hideLoading() {
    elements.loading.classList.add('hidden');
}

function showToast(message, type = 'default', duration = 3000) {
    const toastMessage = elements.toast.querySelector('.toast-message');
    toastMessage.textContent = message;
    
    // 清除之前的类型样式
    elements.toast.classList.remove('success', 'error', 'warning');
    
    // 添加新的类型样式
    if (type !== 'default') {
        elements.toast.classList.add(type);
    }
    
    elements.toast.classList.remove('hidden');
    
    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, duration);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function isDateInPast(dateStr) {
    const selectedDateObj = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDateObj < today;
}

// API 调用函数
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    try {
        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        throw error;
    }
}

// 用户相关函数
async function loginUser(username) {
    try {
        const result = await apiCall('/users/login', {
            method: 'POST',
            body: JSON.stringify({ username })
        });
        return result;
    } catch (error) {
        showToast('登录失败，请检查网络连接', 'error');
        throw error;
    }
}

// 订单相关函数
async function fetchOrders(date, period) {
    try {
        const result = await apiCall(`/orders/${date}/${period}`);
        return result;
    } catch (error) {
        console.error('获取订单失败:', error);
        return { orders: [], stats: {} };
    }
}

async function submitOrderData(orderData) {
    try {
        const result = await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        return result;
    } catch (error) {
        showToast('提交订单失败，请重试', 'error');
        throw error;
    }
}

async function deleteOrderData(orderId) {
    try {
        const result = await apiCall(`/orders/${orderId}`, {
            method: 'DELETE'
        });
        return result;
    } catch (error) {
        showToast('删除订单失败，请重试');
        throw error;
    }
}

// 页面导航函数
function showUserPage() {
    elements.userPage.classList.remove('hidden');
    elements.datePage.classList.add('hidden');
    elements.orderPage.classList.add('hidden');
    stopPolling();
}

function showDatePage() {
    elements.userPage.classList.add('hidden');
    elements.datePage.classList.remove('hidden');
    elements.orderPage.classList.add('hidden');
    
    // 显示当前用户名
    elements.currentUsername.textContent = currentUser.username;
    
    // 设置默认日期为今天 (修正时区问题)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    elements.orderDate.value = today;
    
    stopPolling();
}

function showOrderPage() {
    elements.userPage.classList.add('hidden');
    elements.datePage.classList.add('hidden');
    elements.orderPage.classList.remove('hidden');
    
    // 显示会话信息
    elements.sessionDate.textContent = formatDate(selectedDate);
    elements.sessionPeriod.textContent = selectedPeriod;

    // 根据日期是否为过去来更新UI状态
    const isPast = isDateInPast(selectedDate);
    const myOrderCard = document.querySelector('.collapsible-card');
    const confirmButton = myOrderCard.querySelector('.btn-primary');

    elements.coffeeType.disabled = isPast;
    elements.remark.disabled = isPast;
    myOrderCard.querySelector('.btn-secondary').disabled = isPast;
    confirmButton.disabled = isPast;

    if (isPast) {
        confirmButton.textContent = '仅供查看';
    } else {
        confirmButton.textContent = '确认订购';
    }
    
    // 恢复折叠状态
    setTimeout(restoreCollapseState, 100);
    
    // 开始轮询更新
    startPolling();
    loadOrders();
}

// 主要业务逻辑
async function setUsername() {
    const username = elements.username.value.trim();
    
    if (!username) {
        showToast('请输入用户名', 'warning');
        return;
    }
    
    if (username.length > 20) {
        showToast('用户名不能超过20个字符', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const result = await loginUser(username);
        currentUser = result.user;
        showDatePage();
        showToast(`欢迎，${currentUser.username}！`, 'success');
    } catch (error) {
        // 错误已在 loginUser 中处理
    } finally {
        hideLoading();
    }
}

function selectTimePeriod(period) {
    const date = elements.orderDate.value;
    
    if (!date) {
        showToast('请先选择日期', 'warning');
        return;
    }
    
    selectedDate = date;
    selectedPeriod = period;
    
    showOrderPage();
}

async function submitOrder() {
    if (isDateInPast(selectedDate)) {
        showToast('过去的日期只能查看, 且不发送请求', 'warning');
        return;
    }

    const coffeeType = elements.coffeeType.value;
    const remark = elements.remark.value.trim();
    
    if (!coffeeType) {
        showToast('请选择咖啡类型', 'warning');
        return;
    }
    
    if (remark.length > 10) {
        showToast('备注不能超过10个字符', 'warning');
        return;
    }
    
    showLoading();
    
    try {
        const orderData = {
            userId: currentUser.id,
            date: selectedDate,
            timePeriod: selectedPeriod,
            coffeeType: coffeeType,
            remark: remark
        };
        
        await submitOrderData(orderData);
        showToast('订购成功！', 'success');
        loadOrders(); // 立即刷新订单列表
    } catch (error) {
        // 错误已在 submitOrderData 中处理
    } finally {
        hideLoading();
    }
}

async function clearMyOrder() {
    if (isDateInPast(selectedDate)) {
        showToast('过去的日期只能查看', 'warning');
        return;
    }

    if (!confirm('确定要清除你的订购吗？')) {
        return;
    }
    
    showLoading();
    
    try {
        const result = await apiCall(`/orders/user/${currentUser.id}/${selectedDate}/${selectedPeriod}`, {
            method: 'DELETE'
        });
        
        elements.coffeeType.value = '';
        elements.remark.value = '';
        updateCharCount();
        showToast('订购已清除', 'success');
        loadOrders();
    } catch (error) {
        showToast('清除失败，请重试', 'error');
    } finally {
        hideLoading();
    }
}

async function loadOrders() {
    try {
        const result = await fetchOrders(selectedDate, selectedPeriod);
        updateOrdersDisplay(result.orders, result.stats);
        updateRefreshTime();
    } catch (error) {
        console.error('加载订单失败:', error);
    }
}

function updateOrdersDisplay(orders, stats) {
    elements.totalCount.textContent = orders.length;
    
    if (orders.length === 0) {
        elements.ordersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <p>还没有人订购咖啡</p>
            </div>
        `;
        return;
    }
    
    // 构建订单列表HTML
    let ordersHTML = '';
    orders.forEach(order => {
        ordersHTML += `
            <div class="order-item">
                <div class="order-info">
                    <div class="order-user">${order.username}</div>
                    <div class="order-coffee">${order.coffeeType}</div>
                    ${order.remark ? `<div class="order-remark">${order.remark}</div>` : ''}
                </div>
            </div>
        `;
    });
    
    // 添加统计信息
    if (stats && Object.keys(stats).length > 0) {
        ordersHTML += `
            <div class="coffee-stats">
                ${Object.entries(stats).map(([coffee, count]) => `
                    <div class="stats-item">
                        <span class="stats-coffee">${coffee}</span>
                        <span class="stats-count">${count}杯</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    elements.ordersList.innerHTML = ordersHTML;
    
    // 如果当前用户有订单，填充表单
    const myOrder = orders.find(order => order.userId === currentUser.id);
    if (myOrder) {
        elements.coffeeType.value = myOrder.coffeeType;
        elements.remark.value = myOrder.remark || '';
        updateCharCount();
    }
}

function updateRefreshTime() {
    const refreshTime = document.querySelector('.refresh-time');
    if (refreshTime) {
        const now = new Date();
        refreshTime.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} 更新`;
    }
}

// 轮询功能
function startPolling() {
    stopPolling(); // 确保没有重复的轮询
    pollInterval = setInterval(loadOrders, 3000); // 每3秒轮询一次
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

// 字符计数功能
function updateCharCount() {
    const charCount = document.querySelector('.char-count');
    if (charCount) {
        const length = elements.remark.value.length;
        charCount.textContent = `${length}/10`;
        charCount.style.color = length > 10 ? '#e74c3c' : 'var(--text-muted)';
    }
}

// 事件监听器
document.addEventListener('DOMContentLoaded', function() {
    // 用户名输入框回车键支持
    elements.username.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setUsername();
        }
    });
    
    // 备注字符计数
    elements.remark.addEventListener('input', updateCharCount);
    
    // 页面可见性变化处理（当页面重新可见时刷新数据）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !elements.orderPage.classList.contains('hidden')) {
            loadOrders();
        }
    });
});

// 在页面卸载时停止轮询
window.addEventListener('beforeunload', stopPolling);

// 折叠功能
function toggleMyOrderCard() {
    const card = document.querySelector('.collapsible-card');
    const icon = document.getElementById('myOrderIcon');
    
    card.classList.toggle('collapsed');
    
    // 保存折叠状态到 localStorage
    const isCollapsed = card.classList.contains('collapsed');
    localStorage.setItem('myOrderCollapsed', isCollapsed);
}

// 恢复折叠状态
function restoreCollapseState() {
    const isCollapsed = localStorage.getItem('myOrderCollapsed') === 'true';
    const card = document.querySelector('.collapsible-card');
    
    if (isCollapsed && card) {
        card.classList.add('collapsed');
    }
}

// 开发模式：自动填充测试数据
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🧪 开发模式已启用');
    // 可以在这里添加测试用的自动填充逻辑
}