/**
 * 双十一超级星秀猫脚本
 * 支持淘宝+支付宝任务自动执行
 * 
 * Author: Hyue418
 * Date: 2020/10/21
 * Time: 21:16
 * Versions: 1.3.1
 * Github: https://github.com/hyue418
 */

"auto";
console.show();
speed = 1;
float = 1.25;
height = device.height;
width = device.width;
setScreenMetrics(width, height);
swipeTips = "滑啊滑啊滑啊滑";

alert("【双11超级星秀猫脚本 v1.3.1】\n\n请确保使用低版本淘宝（V9.5及以下），否则无法获取奖励\n\nPowered By Hyue418");
log("淘宝双11超级星秀猫脚本");
log("Powered By Hyue418");
log("Github: https://github.com/hyue418");
log("=================== ");

//执行淘宝任务
taskList = ['去浏览', '去搜索', '领取奖励', '去完成'];
activityData = "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index";
run("淘宝", activityData, taskList);

//执行支付宝任务
taskList = ['逛一逛', '签到'];
activityData = "alipays://platformapi/startapp?appId=68687502";
run("支付宝", activityData, taskList);

alert("所有任务貌似都做完啦！\n若仍有任务请重新运行噢！\n\nPowered By Hyue418");
log("Powered By Hyue418");
log("Github: https://github.com/hyue418");

/**
 * 主方法
 * @param appName 
 * @param activityData 
 * @param taskList 
 */
function run(appName, activityData, taskList) {
    var i = j = 0;
    toastLog("打开【" + appName + "】活动页");
    app.startActivity({
        action: "VIEW",
        data: activityData
    })
    randomSleep(1000 * speed);
    className("android.widget.Button").text("赚喵币").waitFor()
    randomSleep(1000 * speed);
    if (!textContains("累计任务奖励").exists()) {
        clickContent("赚喵币");
    }
    randomSleep(1500 * speed);
    if (className("android.widget.Button").text("领取奖励").exists()) {
        clickContent("领取奖励");
        randomSleep(200 * speed);
        log("领取奖励成功");
    }
    randomSleep(1500 * speed);
    taskList.forEach(task => {
        while (textContains(task).exists()) {
            log("开始做第" + (i + 1) + "次任务");
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            switch (task) {
                case '去搜索':
                case '逛一逛':
                case '去完成':
                    log("开始【" + task + "】任务")
                    clickButton(button);
                    randomSleep(2000 * speed);
                    if (textContains("复制链接").exists()) {
                        log("跳过分享任务");
                        j++;
                        i++;
                        back();
                        sleep(200 * speed);
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
                    //支付宝任务返回后需要点击确认按钮
                    if (appName == '支付宝') {
                        randomSleep(2000 * speed);
                        clickContent('好的，我知道了');
                    }
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
                case '签到':
                    clickButton(button);
                    randomSleep(1500 * speed);
                    log("【" + task + "】成功")
                    //支付宝任务签到后需要点击确认按钮
                    if (appName == '支付宝') {
                        clickContent('好的，我知道了');
                    }
                    break;
                default:
                    break;
            }
            randomSleep(2000 * speed);
        }
    });
    toastLog("【" + appName + "】任务已完成");
    log("=================== ");
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