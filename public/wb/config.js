// ============================================
// 💝 在这里定制你的表白网站 💝
// ============================================

const CONFIG = {
    // 对方的名字，会显示在标题中
    valentineName: "王博",

    // 浏览器标签页标题
    pageTitle: "王博，你愿意和我在一起吗？💝",

    // 背景漂浮的表情
    floatingEmojis: {
        hearts: ['❤️', '💖', '💝', '💗', '💓'],  // 爱心表情
        bears: ['🧸', '🐻']                       // 可爱小熊
    },

    // 问题与回答
    questions: {
        first: {
            text: "你喜欢我吗？",                                    // 第一个问题
            yesBtn: "喜欢",                                         // "喜欢"按钮
            noBtn: "不喜欢",                                        // "不喜欢"按钮
            secretAnswer: "口是心非，你明明爱我！❤️"               // 隐藏的表白语
        },
        second: {
            text: "那你有多爱我？",                                  // 爱意测量
            startText: "这么多！",                                   // 百分比前的文字
            nextBtn: "下一步 ❤️"                                    // 下一步按钮
        },
        third: {
            text: "王博，你愿意和我在一起吗？🌹",                    // 最重要的问题！
            yesBtn: "愿意！",                                        // "愿意"按钮
            noBtn: "不愿意"                                          // "不愿意"按钮
        }
    },

    // 爱意测量仪的不同档位文案
    loveMessages: {
        extreme: "哇！你居然这么爱我？！🥰🚀💝",  // 超过 5000% 时显示
        high: "爱到天荒地老！🚀💝",              // 超过 1000% 时显示
        normal: "还要更多！🥰"                   // 超过 100% 时显示
    },

    // 对方点击"愿意"后显示的庆祝文案
    celebration: {
        title: "耶！我是全世界最幸运的人！🎉💝💖💝💓",
        message: "快来领取你的礼物：一个大大的拥抱和亲亲！",
        emojis: "🎁💖🤗💝💋❤️💕"  // 这些表情会四处弹跳
    },

    // 网站配色
    colors: {
        backgroundStart: "#ffafbd",      // 背景渐变起始色
        backgroundEnd: "#ffc3a0",        // 背景渐变结束色
        buttonBackground: "#ff6b6b",     // 按钮颜色
        buttonHover: "#ff8787",          // 按钮悬停颜色
        textColor: "#ff4757"             // 文字颜色
    },

    // 动画设置
    animations: {
        floatDuration: "15s",           // 爱心上浮时长
        floatDistance: "50px",          // 爱心左右漂移距离
        bounceSpeed: "0.5s",            // 弹跳动画速度
        heartExplosionSize: 1.5         // 爱心爆炸效果大小
    },

    // 背景音乐（可选）
    music: {
        enabled: true,                     // 开启音乐功能
        autoplay: true,                    // 尝试自动播放（部分浏览器会拦截）
        musicUrl: "https://res.cloudinary.com/dncywqfpb/video/upload/v1738399057/music_qrhjvy.mp3",
        startText: "🎵 播放音乐",          // 播放按钮文字
        stopText: "🔇 停止音乐",           // 停止按钮文字
        volume: 0.5                        // 音量（0.0 到 1.0）
    }
};

// 下面的内容不懂就不要改了
window.VALENTINE_CONFIG = CONFIG;
