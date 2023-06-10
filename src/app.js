const colorMode = document.querySelector('.color-mode')
const input = document.querySelector('#input-text')
const sendButton = document.querySelector('.send-button')
const wrapper = document.querySelector('.wrapper')

function connect(url, { name, colorMode, input, sendButton, wrapper }) {
    // 创建 WebSocket 对象
    const socket = new WebSocket(url)
    // 设置颜色模式
    const theme = useDark()
    setColorMode(theme.isDark)
    // 初始化
    init()

    function init() {
        initListener()
        initWebsocket()
    }

    function sendMessage(data, receiver) {
        const messageObj = {
            type: 'message',
            data,
            receiver
        }

        socket.send(JSON.stringify(messageObj))
    }

    function cleanInput() {
        input.value = ''
    }

    function getInputText() {
        return input.value.trim()
    }

    function initListener() {
        // 切换颜色模式
        colorMode.addEventListener('click', function () {
            theme.toggle()
            setColorMode(theme.isDark)
        })
        // 发送消息
        sendButton.addEventListener('click', handleSend)

        // 监听回车键
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                handleSend()
            }
        })
    }

    function handleSend() {
        const text = getInputText()
        // 如果输入为空，则不发送
        if (!text)
            return
        // 发送消息
        sendMessage(text, name)
        // 创建消息元素
        const message = createMessage('me', text, true)
        // 添加到消息列表
        wrapper.appendChild(message)
        // 滚动到底部
        message.scrollIntoView({
            behavior: 'smooth'
        })
        // 清空输入框
        cleanInput()
    }

    function createMessage(name, message, isSelf) {
        const article = document.createElement('article')
        const h3 = document.createElement('h3')
        const p = document.createElement('p')
        article.className = 'message ' + (isSelf ? 'owner' : 'other')
        h3.textContent = name
        p.textContent = message
        article.append(h3, p)
        return article
    }

    function setColorMode(isDark) {
        if (isDark) {
            colorMode.textContent = '🌞'
        } else {
            colorMode.textContent = '🌙'
        }
    }

    function useDark(initial) {
        let isDark = initial || window.matchMedia('(prefers-color-scheme: dark)').matches
        const toggle = () => {
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
        toggle()
        return {
            get isDark() {
                return isDark
            },
            toggle() {
                isDark = !isDark
                toggle()
            }
        }
    }

    function initWebsocket() {
        // 监听服务端连接
        socket.onopen = function (event) {
            console.log('Server connected......');
        }
        // 监听服务端消息
        socket.onmessage = function (event) {
            // 获取消息内容
            const { receiver, data } = JSON.parse(event.data)
            // 创建消息元素
            const messageEl = createMessage(receiver, data, false)
            wrapper.appendChild(messageEl)
            // 滚动到底部
            messageEl.scrollIntoView({
                behavior: 'smooth'
            })
        }
        // 监听服务端关闭
        socket.onclose = function (event) {
            console.log('Server closed......');
        }
        // 监听服务端错误
        socket.onerror = function (event) {
            console.log('Server error......');
        }
    }
}



