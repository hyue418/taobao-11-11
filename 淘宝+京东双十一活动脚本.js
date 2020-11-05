/**
 * 淘宝+京东双十一活动脚本
 * 支持淘宝\支付宝\京东任务自动执行
 *
 * Author: Hyue418
 * Date: 2020/10/21
 * Time: 21:16
 * Versions: 2.4.0
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
versions = 'V2.4.0';
speed = 1;
float = 1.25;
patNum = 0;
swipeTips = "滑啊滑啊滑啊滑ヽ(￣▽￣)ﾉ";
taskChooseList = ["淘宝赚喵币", "淘宝拍猫猫", "支付宝赚喵币", "京东全民营业", "调节脚本速度"];
speedChooseList = [0.75, 1, 1.25, 1.5, 1.75, 2, 3];
taobaoActivityData = "taobao://pages.tmall.com/wow/z/hdwk/act-20201111/index";
activityActivityData = "alipays://platformapi/startapp?appId=68687502";
width = device.width;
height = device.height;
setScreenMetrics(width, height);

alert("【淘宝+京东双十一活动脚本 " + versions + "】", "脚本执行过程请勿手动点击屏幕，否则脚本执行可能会错乱，导致任务失败\n执行过程中可按音量+键终止\n\n执行淘宝任务时请确保使用低版本淘宝（V9.5及以下），否则无法获取奖励\n\n最新版脚本请到GitHub获取\nGitHub: https://github.com/hyue418\n\nPowered By Hyue418");
//选择任务
taskChoose();

/**
 * 任务选择
 */
function taskChoose() {
    var options = dialogs.multiChoice("需要执行的任务", taskChooseList);
    if (options == '') {
        toastLog("脚本已退出");
        exit();
    }
    //勾选调速时弹出速度选择
    options.indexOf(4) > -1 && speedChoose();
    //选中拍猫猫时弹出次数选择
    if (options.indexOf(1) > -1) {
        var frequencyOptions = [50, 100, 200, 300, 400, 500];
        var i = dialogs.select(
            "拍猫猫次数",
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
 * 速度选择
 */
function speedChoose() {
    var option = dialogs.singleChoice("操作间隔的倍数（越大越慢）", speedChooseList, 1);
    if (option == -1) {
        toastLog("脚本已退出");
        exit();
    }
    speed = speedChooseList[option];
}

/**
 * 执行选中任务
 * @param options 选项数组
 */
function runOptions(options) {
    console.show();
    log("淘宝+京东双十一活动脚本" + versions + "\n");
    log("脚本执行期间请勿手动点击按钮");
    log("当前脚本操作时间间隔为【" + speed + "倍】");
    log("=========================");
    log("GitHub: https://github.com/hyue418");
    log("Powered By Hyue418");
    log("=========================");
    options.forEach(option => {
        switch (option) {
            case 0:
                //执行淘宝任务
                var taskList = ['签到', '领取', '去浏览', '去搜索', '去观看', '领取奖励', '去完成'];
                log("=====开始执行" + taskChooseList[option] + "=====");
                runTaobao("手机淘宝", taobaoActivityData, taskList);
                break;
            case 1:
                //执行拍猫猫任务
                log("=====开始执行" + taskChooseList[option] + "=====");
                options.indexOf(0) > -1 ? patCat(patNum, 1) : patCat(patNum, 2);
                break;
            case 2:
                //执行支付宝任务
                var taskList = ['签到', '逛一逛'];
                log("=====开始执行" + taskChooseList[option] + "=====");
                activityData = "alipays://platformapi/startapp?appId=68687502";
                runTaobao("支付宝", activityActivityData, taskList);
                break;
            case 3:
                //执行京东任务
                var taskList = ['签到', '去完成'];
                log("=====开始执行" + taskChooseList[option] + "=====");
                runJd(taskList);
                break;
            default:
                break;
        }
    });
    log("GitHub: https://github.com/hyue418");
    log("Powered By Hyue418");
    alert("任务已完成", "所有任务貌似都做完啦！\n若仍有任务请重新运行噢！\n\nGitHub: https://github.com/hyue418\nPowered By Hyue418");
}

/**
 * 淘宝活动脚本，兼容淘宝&支付宝
 * @param appName
 * @param activityData
 * @param taskList
 */
function runTaobao(appName, activityData, taskList) {
    var i = j = 0;
    toastLog("打开【" + appName + "】活动页");
    app.startActivity({
        action: "VIEW",
        data: activityData
    });
    randomSleep(1000 * speed);
    className("android.widget.Button").text("赚喵币").waitFor();
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
                    log("开始【" + task + "】任务");
                    clickButton(button);
                    randomSleep(500 * speed);
                    //若未点击成功，则再次点击
                    while (textContains(task).exists()) {
                        clickButton(button);
                        randomSleep(300 * speed);
                    }
                    randomSleep(2500 * speed);
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
                    clickButton(button);
                    randomSleep(500 * speed);
                    //若未点击成功，则再次点击
                    while (textContains(task).exists()) {
                        clickButton(button);
                        randomSleep(300 * speed);
                    }
                    randomSleep(3500 * speed);
                    if (textContains("观看").exists() && textContains("关注").exists()) {
                        //进入直播页面直接等待，不滑屏
                        randomSleep(18000 * speed);
                    } else {
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(5500 * speed);
                        toast(swipeTips);
                        randomSwipe();
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
                    log("跳过");
                    break;
            }
            randomSleep(2000 * speed);
        }
    });
    toastLog("【" + appName + "】任务已完成");
    log("=========================");
}

/**
 * 京东活动脚本
 */
function runJd(taskList) {
    var i = 0;
    var j = 2;
    var activityButton = "浮层活动";
    launch("com.jingdong.app.mall");
    randomSleep(3000 * speed);
    if (!descContains(activityButton).exists()) {
        alert("温馨提示", "首页没有找到【全民营业】活动入口浮层\n请手动打开活动页，进入后脚本会自动执行");
    } else {
        clickContent(activityButton, "desc");
        log("正在打开【京东】活动页");
        randomSleep(300 * speed);
        //部分账号首页的活动浮层默认是收起状态，再次点击(有时候会点击失败，所以用while)
        while (descContains(activityButton).exists()) {
            clickContent(activityButton, "desc");
            randomSleep(300 * speed);
        }
        toastLog("若页面有弹窗，请手动关闭");
        randomSleep(5000 * speed);
    }
    jdcollectCoins();
    randomSleep(500 * speed);
    jdcollectCoins();
    toastLog("收取金币成功");
    randomSleep(1000 * speed);
    text("领金币").waitFor();
    clickContent("领金币");
    log("展开任务列表");
    randomSleep(1000 * speed);
    //未打开任务列表则再次尝试点击
    while (!textContains("去完成").exists() && !textContains("已完成").exists()) {
        clickContent("领金币");
        randomSleep(300 * speed);
    }
    taskList.forEach(task => {
        while (textContains(task).exists()) {
            var button = text(task).findOnce(j);
            if (button == null) {
                break;
            }
            log("开始做第" + (i + 1) + "次任务");
            switch (task) {
                case '签到':
                    jdClickButton(button);
                    log("签到成功");
                    i++;
                    randomSleep(1000 * speed);
                    break;
                case '去完成':
                    var k = 0;
                    //任务标题
                    var taskTitle = button.parent().child(1).getText();
                    jdClickButton(button);
                    randomSleep(1000 * speed);
                    if (className("android.view.View").textContains("取消").exists()) {
                        log("跳过助力任务");
                        j++;
                        i++;
                        clickContent("取消");
                        randomSleep(1000 * speed);
                        break;
                    } else {
                        randomSleep(1000 * speed);
                        //若未点击成功，则再点击五次，仍未成功则跳过
                        while (textContains(task).exists() && k < 5) {
                            jdClickButton(button);
                            randomSleep(300 * speed);
                            k++;
                        }
                        if (k >= 5) {
                            log("跳过该任务");
                            break;
                        }
                    }
                    randomSleep(2000 * speed);
                    //微信小程序任务
                    // if (taskTitle.indexOf("小程序") != -1) {
                    //     randomSleep(1000 * speed);
                    //     launch("com.jingdong.app.mall");
                    //     log("已完成");
                    //     randomSleep(2000 * speed);
                    //     break;
                    // }
                    if (textContains("联合开卡").exists() || textContains("商圈红包").exists()) {
                        log("跳过任务");
                        j++;
                        i++;
                        back();
                        randomSleep(500 * speed);
                        break;
                    } else if (textContains("任意浏览").exists()) {
                        jdBrowsingOrShopping("浏览");
                        back();
                        randomSleep(500 * speed);
                        break;
                    } else if (textContains("任意加购").exists()) {
                        jdBrowsingOrShopping("加购");
                        back();
                        randomSleep(500 * speed);
                        break;
                    }
                    if (textContains("宠汪汪").exists() || textContains("京喜财富岛").exists() || textContains("天天加速").exists()) {
                        randomSleep(10000 * speed);
                    } else {
                        randomSleep(2500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(2200 * speed);
                        toast(swipeTips);
                        randomSwipe();
                        randomSleep(3500 * speed);
                        toast(swipeTips);
                        randomSwipe();
                    }
                    descContains("获得").findOne(8000 * speed);
                    randomSleep(500 * speed);
                    i++;
                    if (textContains("京友圈").exists() || textContains("东东超市").exists()) {
                        back();
                        randomSleep(500 * speed);
                    }
                    log("已完成");
                    back();
                    randomSleep(4000 * speed);
                    break;
                default:
                    log("跳过")
                    break;
            }
        }
    });
    toastLog("【京东】任务已完成");
    log("=========================");
}

/**
 * 京东-浏览/加购任务
 * @param taskName 任务名：浏览/加购
 */
function jdBrowsingOrShopping(taskName) {
    log("进入【" + taskName + "】任务");
    toastLog("日志窗口已隐藏");
    console.hide();
    randomSleep(200 * speed);
    for (i = 0; i < 6; i++) {
        if (i == 4) {
            toastLog(swipeTips);
            randomSwipe();
            randomSleep(500 * speed);
        }
        var price = textContains("¥").findOnce(i);
        var goods = price.parent().parent();
        var suffix = i == 5 ? "(容错)" : '';
        log(taskName + "第" + (i + 1) + "个商品" + suffix);
        if (taskName == "浏览") {
            jdClickButton(goods);
            randomSleep(1000 * speed);
            //若未点击成功，则再次点击
            while (textContains("任意浏览").exists()) {
                jdClickButton(goods);
                randomSleep(300 * speed);
            }
            randomSleep(3000 * speed);
            //商品页可能会有缺货弹窗，点掉
            if (textContains("取消").exists()) {
                clickContent("取消");
                randomSleep(500 * speed);
            }
            toastLog(swipeTips);
            randomSwipe();
            randomSleep(1000 * speed);
            back();
            randomSleep(1500 * speed);
        } else if (taskName == "加购") {
            var shopping = goods.child(goods.child(0).text() == "已加购" ? 5 : 4);
            click(shopping.bounds().centerX(), shopping.bounds().centerY());
            randomSleep(2500 * speed);
        }
    }
    console.show();
}

/**
 * 京东-收取金币
 */
function jdcollectCoins() {
    var collectButton = text("收取金币").findOnce();
    collectButton && jdClickButton(collectButton);
}

/**
 * 淘宝-拍猫猫任务
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
        });
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
    press(random(bounds.left, bounds.right), random(bounds.top, bounds.bottom), random(50, 100));
}

/**
 * 根据控件的坐标范围随机模拟点击（京东用）
 * 京东任务按钮有圆角，通用的随机点击方法容易点出圆角外导致点击失效，此处做修正
 * @param button
 */
function jdClickButton(button) {
    var bounds = button.bounds();
    var width = bounds.right - bounds.left;
    var high = bounds.top - bounds.bottom;
    press(random(bounds.left + width / 4, bounds.right - width / 4), random(bounds.top + high / 3, bounds.bottom - high / 3), random(50, 100));
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
    }
    ;
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