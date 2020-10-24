/**
 * 双十一超级星秀猫脚本
 * 支持淘宝+支付宝任务自动执行
 * 
 * Author: Hyue418
 * Date: 2020/10/21
 * Time: 21:16
 * Versions: 1.4.2
 * Github: https://github.com/hyue418
 */

try {
    auto();
} catch (error) {
    toast("请手动开启无障碍并授权给Auto.js");
    sleep(2000);
    exit();
}
//初始化参数
versions = 'V1.4.2';
speed = 1;
float = 1.25;
patNum = 0;
swipeTips = "滑啊滑啊滑啊滑";
taobaoActivityData = "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index";
activityActivityData = "alipays://platformapi/startapp?appId=68687502";

height = device.height;
width = device.width;
setScreenMetrics(width, height);

console.show();
log("淘宝双11超级星秀猫脚本" + versions);
log("GitHub: https://github.com/hyue418");
log("Powered By Hyue418");
log("=========================");
alert("【双11超级星秀猫脚本 " + versions + "】", "请确保使用低版本淘宝（V9.5及以下），否则无法获取奖励\n\n最新版脚本请到GitHub获取\nGitHub: https://github.com/hyue418\n\nPowered By Hyue418");
//开始执行任务弹窗
taskChoose();
log("GitHub: https://github.com/hyue418");
log("Powered By Hyue418");
alert("任务已完成", "所有任务貌似都做完啦！\n若仍有任务请重新运行噢！\n\nGitHub: https://github.com/hyue418\nPowered By Hyue418");

/**
 * 任务选择
 */
function taskChoose() {
    var options = dialogs.multiChoice("请选择需要执行的任务", ["淘宝赚喵币", "淘宝拍猫猫", "支付宝赚喵币"], [0, 2]);
    if (options == '') {
        toastLog("脚本已退出");
        exit();
    }
    //选中拍猫猫时弹出次数选择
    if (options.indexOf(1) > -1) {
        var frequencyOptions = [10, 30, 50, 100, 200];
        var i = dialogs.select(
            "请选择拍猫猫次数",
            frequencyOptions
        );
        if (i == -1) {
            toastLog("脚本已退出");
            exit();
        }
        //拍猫次数加随机数，向下取整
        patNum = Math.floor(ramdomByFloat(frequencyOptions[i]));
        toastLog("选择拍猫猫" + frequencyOptions[i] + "次,加随机数至" + patNum + "次");
    }
    runOptions(options);
}

/**
 * 执行选中任务
 * @param options 选项数组
 */
function runOptions(options) {
    options.forEach(option => {
        switch (option) {
            case 0:
                //执行淘宝任务
                var taskList = ['签到', '领取', '去浏览', '去搜索', '去观看', '领取奖励', '去完成'];
                run("手机淘宝", taobaoActivityData, taskList);
                break;
            case 1:
                //执行拍猫猫任务
                options.indexOf(0) > -1 ? patCat(patNum, 1) : patCat(patNum, 2);
                break;
            case 2:
                //执行支付宝任务
                var taskList = ['签到', '逛一逛'];
                activityData = "alipays://platformapi/startapp?appId=68687502";
                run("支付宝", activityActivityData, taskList);
                break;
            default:
                break;
        }
    });
}

/**
 * 主任务方法，兼容淘宝&支付宝
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
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            log("开始做第" + (i + 1) + "次任务");
            switch (task) {
                case '去搜索':
                case '逛一逛':
                case '去完成':
                    log("开始【" + task + "】任务")
                    clickButton(button);
                    randomSleep(3000 * speed);
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
                    randomSleep(5000 * speed);
                    toast(swipeTips);
                    randomSwipe();
                    randomSleep(6000 * speed);
                    toast(swipeTips);
                    randomSwipe();
                    descContains("任务完成").findOne(8000 * speed);
                    randomSleep(1000 * speed);
                    i++;
                    log("已完成");
                    back();
                    //支付宝任务返回后需要点击确认按钮
                    if (appName == '支付宝') {
                        randomSleep(2000 * speed);
                        clickContent('好的，我知道了');
                    }
                    break;
                case '去观看':
                case '去浏览':
                    log("开始【" + task + "】任务")
                    randomSleep(500 * speed);
                    clickButton(button);
                    randomSleep(3000 * speed);
                    if (!textContains("跟主播聊").exists() || !textContains("赚金币").exists()) {
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(5500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                    } else {
                        randomSleep(15000 * speed);
                    }
                    textContains("全部完成").findOne(8000 * speed);
                    randomSleep(1000 * speed);
                    i++;
                    log("已完成")
                    back();
                    break;
                case '领取奖励':
                case '签到':
                case '领取':
                    clickButton(button);
                    randomSleep(1500 * speed);
                    log("【" + task + "】成功")
                    //支付宝任务签到后需要点击确认按钮
                    if (appName == '支付宝') {
                        clickContent('好的，我知道了');
                    }
                    break;
                default:
                    log("跳过")
                    break;
            }
            randomSleep(2000 * speed);
        }
    });
    toastLog("【" + appName + "】任务已完成");
    log("=========================");
}

/**
 * 拍猫猫任务
 * @param num 拍猫猫次数
 * @param type 任务执行类型：1当前页面执行，2打开淘宝APP执行
 */
function patCat(num, type) {
    if (type == 1) {
        clickContent("关闭");
    } else if (type == 2) {
        toastLog("打开【淘宝】活动页");
        app.startActivity({
            action: "VIEW",
            data: taobaoActivityData
        })
    }
    log("开始【拍猫猫】");
    if (num == 0) {
        return true;
    }
    toastLog("正在疯狂撸猫中...");
    for (var i = 0; i < num; i++) {
        clickContent("我的猫，点击撸猫", "text", 100);
    }
    toastLog("【拍猫猫】任务已完成，共拍猫" + num + "次");
    log("=========================");
}

/**
 * 通过文字内容模拟点击按钮
 * @param content 按钮文字内容
 * @param type 点击类型，默认为text点击
 * @param sleepTime 等待时间，默认1000毫秒
 */
function clickContent(content, type, sleepTime) {
    var type = type || "text";
    var sleepTime = sleepTime || 1000;
    sleep(sleepTime * float * speed);
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