/**
 * Created by Visual Studio Code
 * User: Hyue418
 * Date: 2020/10/21
 * Time: 21:16
 * Versions: 1.2.1
 * Github: https://github.com/hyue418
 */

"auto";
alert("请确保使用淘宝V9.5版本\n高版本有进程检测会被制裁，奖励极低\n\nPowered By Hyue418");
console.show();
speed = 1;
float = 1.25;
swipeTips = "滑啊滑啊滑啊滑";
height = device.height;
width = device.width;
setScreenMetrics(width, height);
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
    app.startActivity({
        action: "VIEW",
        data: "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index"
    })
    log("进入活动页面");
    randomSleep(1000 * speed);
    className("android.widget.Button").text("赚喵币").waitFor()
    randomSleep(1000);
    if (!textContains("累计任务奖励").exists()) {
        clickContent("赚喵币");
    }
    randomSleep(1500 * speed);
    if (className("android.widget.Button").text("领取奖励").exists()) {
        clickContent("领取奖励");
        randomSleep(200);
        log("领取奖励成功");
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
                    log("开始【" + task + "】任务")
                    clickButton(button);
                    randomSleep(2000 * speed);
                    if (textContains("复制链接").exists()) {
                        log("跳过分享任务");
                        j++;
                        i++;
                        back();
                        sleep(200);
                        back();
                        break;
                    }
                    if (textContains("淘宝特价版送红包").exists()) {
                        log("跳过打开APP任务");
                        j++;
                        i++;
                        back();
                        break;
                    }
                    toast(swipeTips);
                    randomSwipe();
                    randomSleep(2000 * speed);
                    toast(swipeTips);
                    randomSwipe();
                    randomSleep(2000 * speed);
                    toast(swipeTips);
                    randomSwipe();
                    textContains("任务完成").findOne(10000 * speed);
                    i++;
                    log("已完成第" + i + "次任务！");
                    back();
                    break;
                case '去浏览':
                    log("开始【" + task + "】任务")
                    randomSleep(500 * speed);
                    clickButton(button);
                    randomSleep(1500 * speed);
                    if (!textContains("跟主播聊").exists() || !textContains("赚金币").exists()) {
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(12000 * speed);
                        toast(swipeTips);
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
    alert("任务貌似做完啦！\n若仍有任务请重新运行！\n\nPowered By Hyue418");
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
 * @param time 
 */
function randomSleep(time) {
    sleep(ramdomByFloat(time));
}

/**
 * 随机滑动
 */
function randomSwipe() {
    smlMove(ramdomByFloat(width / 2), ramdomByFloat(height / 1.5), ramdomByFloat(width / 2), ramdomByFloat(height / 4), ramdomByFloat(800));
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

/**
 * 仿真随机带曲线滑动 
 * @param qx 起点x轴坐标
 * @param qy 起点y轴坐标
 * @param zx 终点x轴坐标
 * @param zy 终点y轴坐标
 * @param time 滑动时间，毫秒
 */
function smlMove(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - 100, qx + 100),
        "y": random(qy, qy + 50)
    };
    var dx2 = {
        "x": random(zx - 100, zx + 100),
        "y": random(zy, zy + 50),
    };
    var dx3 = {
        "x": zx,
        "y": zy
    };
    for (var i = 0; i < 4; i++) {
        eval("point.push(dx" + i + ")");
    };
    for (let i = 0; i < 1; i += 0.08) {
        xxyy = [parseInt(bezierCurves(point, i).x), parseInt(bezierCurves(point, i).y)];
        xxy.push(xxyy);
    }
    gesture.apply(null, xxy);
};

function bezierCurves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};