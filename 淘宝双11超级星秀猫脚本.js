/**
 * Created by Visual Studio Code
 * User: Hyue418
 * Date: 2020/10/21
 * Time: 21:16
 * Versions: 1.0.0
 * Github: https://github.com/hyue418
 */

"auto";
console.show();
height = device.height;
width = device.width;
setScreenMetrics(width, height);
speed = 1;
float = 1.25;
run();

/**
 * 淘宝超级星秀猫脚本
 * 模拟纯人工点击版
 */
function run() {
    var i = j = 0;
    var taskList = ['去浏览', '去搜索', '领取奖励', '去完成'];
    log("淘宝双11超级星秀猫脚本");
    log("Powered By Hyue418");
    launch("com.taobao.taobao");
    randomSleep(1000 * speed);
    toastLog("请手动进入活动页面")
    className("android.widget.Button").text("赚喵币").waitFor()
    randomSleep(1000);
    if (!textContains("累计任务奖励").exists()) {
        clickContent("赚喵币");
    }
    randomSleep(1500 * speed);
    if (className("android.widget.Button").text("签到").exists()) {
        clickContent("签到");
        randomSleep(200);
        log("签到成功");
    } else {
        log("已签到");
    }
    randomSleep(1500 * speed);
    taskList.forEach(task => {
        while (textContains(task).exists()) {
            log("开始做第" + (i + 1) + "次任务！");
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            switch (task) {
                case '去搜索':
                case '去完成':
                    log("开始" + task + "任务")
                    clickButton(button);
                    randomSleep(1500 * speed);
                    if (textContains("复制链接").exists()) {
                        log("跳过分享任务");
                        j++;
                        i++;
                        back();
                        sleep(200);
                        back();
                        break;
                    }
                    toastLog("滑啊滑啊滑啊滑");
                    randomSwipe();
                    randomSleep(15000 * speed);
                    randomSwipe();
                    textContains("任务完成").findOne(10000 * speed);
                    i++;
                    log("已完成第" + i + "次任务！");
                    back();
                    break;
                case '去浏览':
                    randomSleep(500 * speed);
                    clickButton(button);
                    randomSleep(1500 * speed);
                    if (!textContains("跟主播聊").exists() || !textContains("赚金币").exists()) {
                        toastLog("滑啊滑啊滑啊滑");
                        randomSwipe();
                        randomSleep(3500 * speed);
                        randomSwipe();
                        randomSleep(12000 * speed);
                        randomSwipe();
                    } else {
                        randomSleep(15000 * speed);
                    }
                    textContains("任务完成").findOne(10000 * speed);
                    i++;
                    log("已完成第" + i + "次任务！")
                    back();
                    break;
                case '领取奖励':
                    clickButton(button);
                    randomSleep(1500 * speed);
                    log("领取奖励成功")
                    break;
                default:
                    break;
            }
            randomSleep(2000 * speed);
        }
    });
    alert("任务貌似做完啦！\n如果仍有任务就重新再运行一下吧！\n\nPowered By Hyue418");
}

/**
 * 通过文字内容模拟点击按钮
 * @param content 按钮文字内容
 * @param type 点击类型，默认为text点击
 */
function clickContent(content, type) {
    var type = type || "text";
    sleep(1000);
    if (type == "text") {
        var button = text(content).findOne();
    } else {
        var button = desc(content).findOne();
    }
    clickButton(button);
    toastLog("点击【" + content + "】");
    return button;
}


/**
 * 根据控件的坐标范围随机模拟点击
 * @param button 
 */
function clickButton(button) {
    var bounds = button.bounds();
    click(random(bounds.left, bounds.right), random(bounds.top, bounds.bottom));
}

/**
 * 根据float倍数sleep随机时间
 * @param millisecond 
 */
function randomSleep(millisecond) {
    sleep(ramdomByFloat(millisecond));
}

/**
 * 随机滑动
 */
function randomSwipe() {
    swipe(ramdomByFloat(width / 2), ramdomByFloat(height / 1.5), ramdomByFloat(width / 2), ramdomByFloat(height / 4), ramdomByFloat(800));
}

/**
 * 范围随机数生成
 * @param min 
 * @param max 
 */
function random(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

/**
 * 根据float生成随机数
 * @param number 
 */
function ramdomByFloat(number) {
    return random(number, number * float);
}