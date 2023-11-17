const createCenter = (ctx)=>{
    ctx.beginPath();
    ctx.arc(0,0,5,0,2*Math.PI);
    ctx.stroke();
    ctx,fillStyle = 'black';
    ctx.fill();
}

const drawScale = (ctx)=>{
    // 保存上次状态是为了避免对之前的绘制产生影响。
    // 确保每次绘制都是在一个独立的状态下进行，避免了不必要的错误。
    ctx.save();
    for(let i=0;i<60;i++){
        // 每次旋转一个刻度的角度。60个刻度，每刻度6度
        ctx.rotate(2*Math.PI/60)
        ctx.beginPath();
        /*
        这里的（190,0）和（200,0）是相对于新的原点（200,200）的坐标，把(200,200)看成(0,0)
        所以，实际上刻度线是从时钟边缘开始画的。
        */ 
        ctx.moveTo(190,0);
        ctx.lineTo(200,0);
        ctx.stroke();
    }
    // 恢复到初始状态画大刻度
    // 如果不恢复成上一次保存的状态，那么之后的绘制操作就会在之前的状态基础上进行，可能会导致绘制结果出现错误。
    ctx.restore();
    ctx.save();

    // 五分钟一个大刻度，60分钟12个大刻度
    for(let i=0;i<12;i++){
        // 旋转一个大刻度是5*6=30度
        ctx.rotate(2*Math.PI/12);
        ctx.beginPath();
        ctx.lineTo(178, 0);
        ctx.lineTo(180, 4);
        ctx.lineTo(200, 4);
        // 画圆线使用arc(中心点X,中心点Y,半径,起始角度,结束角度)
        ctx.arc(0, 0, 200, 0, (2 * Math.PI) / 250);
        ctx.lineTo(200, -4);
        ctx.lineTo(180, -4);
        ctx.lineTo(178, 0);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill()
    }
    ctx.restore();
}

const drawNumber = (ctx)=>{
    ctx.save();
    const textRadius = 160;
    const fontSize = 16;
    
    for(let i = 0;i < 12;i++){
        ctx.save()
        // 12个数字，每个数字30度,占圆的1/6  i+1表示第几个数字
        const angle = (Math.PI * (i + 1)) / 6;
        /*
            Math.ceil(i / 8) 将数字 i 分为每 8 个一组，向上取整。
            乘以 8 是为了将微调的范围适应每个数字所在的组。
            最后除以 2 是为了减小微调的幅度，以确保微调不会太大。            
        */ 
        const x = textRadius * Math.sin(angle) - (Math.ceil(i / 8) * 8) / 2;
        const y = -textRadius * Math.cos(angle)  + 12 / 2;

        ctx.font = `${fontSize}px Arial`;
        // fillText(文本, 横坐标, 纵坐标)
        ctx.fillText(i + 1, x, y);
        ctx.restore();
    }
    ctx.restore()
}

const getCurrentTime = ()=>{
    // 获取当前时间
    const time = new Date();
    const hour = time.getHours() % 12;
    const min = time.getMinutes();
    const sec = time.getSeconds();
    const milliSec = time.getMilliseconds();
    return {
        hour,
        min,
        sec,
        milliSec
    }
}

// 画指针
const createPointer = (ctx)=>{
    const {hour,min,sec,milliSec} = getCurrentTime();
    // 保存上一次的状态
    ctx.save();
    // 时针
    /*
    时针总共被分成12份，那么 (2 * Math.PI) / 12) * hour  就是当前时针转的角度，
    当然，还得加上分针所转过的角度才能是时针整体应该转过的角度，所以应该再加上 (2 * Math.PI) / 12) * (min / 60) ，

    坐标系和我们的视野颠倒了180°是因为在常规的坐标系中，正方向是向上的，而时钟的指针是向下转动的，所以需要进行180°的颠倒来匹配。
    由于坐标系和我们的视野正好颠倒了 180°，所以还应该再减去  Math.PI / 2
    */ 
    ctx.rotate(((2 * Math.PI) / 12)*(hour + min / 60) - Math.PI / 2);
    ctx.beginPath();
    // 设置绘制起点
    ctx.moveTo(-3,0)
    // 设置绘制路径
    ctx.lineTo(0,3);
    ctx.lineTo(45,3);
    ctx.lineTo(60,0);
    ctx.lineTo(45,-3);
    ctx.lineTo(0,-3);
    ctx.lineTo(-3,0);
    // 设置颜色 和 宽度
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    // 创建黑色阴影
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 4;
    // 填充颜色
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
    // 恢复上一次的状态
    ctx.restore();
    ctx.save()


    // 分针
    ctx.rotate(((2 * Math.PI) / 60) * (min + sec / 60) - Math.PI / 2);
    ctx.beginPath();
    // 设置画线起点
    ctx.moveTo(-2,0);
    // 设置绘制路径
    ctx.lineTo(0,2);
    ctx.lineTo(52,2);
    ctx.lineTo(120,0);
    ctx.lineTo(52,-2);
    ctx.lineTo(0,-2);
    ctx.lineTo(-2,0);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e80ff';
    ctx.stroke();
    // 创建蓝色阴影
    ctx.shadowColor = '#1e80ff';
    ctx.shadowBlur = 3;
    // 填充颜色
    ctx.fillStyle = '#1e80ff';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
    ctx.save();

    // 秒针
    ctx.rotate(((2*Math.PI)/60)*(sec - 1 + milliSec / 1000) - Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(-1,0);
    ctx.lineTo(0,1);
    ctx.lineTo(120,1);
    ctx.lineTo(140,0);
    ctx.lineTo(120,-1);
    ctx.lineTo(0,-1);
    ctx.lineTo(-1,0);
    ctx.strokeStyle = '#e9686b';
    ctx.stroke();
    // 创建红色阴影
    ctx.shadowColor = '#e9686b';
    ctx.shadowBlur = 2;
    ctx.fillStyle = '#e9686b';
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

const drawClock = (ctx,target)=>{
    if(ctx){
        ctx.save();
        ctx.clearRect(0,0,ctx.width,ctx.height);
         // 移动坐标原点到圆心(此时坐标原点坐标为)
        ctx.translate(200, 200);
        // 画圆心(即时钟中心)及刻度
        createCenter(ctx);
        // 画刻度
        drawScale(ctx);
        // 画数字
        drawNumber(ctx);
        // 画指针
        createPointer(ctx);

        ctx.restore();
    }
}

// 每隔一秒重新绘制一次
const createClock = ()=>{
    const canvas = document.querySelector('.canvas');
    const ctx = canvas.getContext('2d');
    if(canvas){
        ctx.lineWidth = 1;
        ctx.width = 400;
        ctx.height = 400;
    }
    if(ctx){
        const animloop = ()=>{
            drawClock(ctx,canvas);
            // setInterval 并不能和浏览器刷新频率统一，呈现效果并不好，所以选择 window.requestAnimationFrame 
            requestAnimationFrame(animloop);
        };
        animloop();
    }
}
createClock();