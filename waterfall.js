/**
 * @waterfall:  瀑布流
 * box:盒子类名; card:内容类名; cardWidth:内容宽度; margin: 盒子边距;
 */
export class waterfall {
  constructor(boxClass, cardClass, cardWidth, margin){
    this.boxClass = boxClass // box:盒子类名
    this.cardClass = cardClass // card:内容类名;
    this.cardWidth = cardWidth // cardWidth:内容宽度;
    this.margin = margin // margin: 盒子边距

    // 使用定时器异步，解决react， componentDidMount之后dom没有完全挂载，计算高度出现错误
    let time = setTimeout(() => {
      this.init()
      clearTimeout(time)
    })
  }

  init = () => {
    this.initPosition() // 初始化所有盒子位置
    this.waterfall() // 瀑布流位置计算
    this.resize() // 浏览器缩放
  }

  /**
   * @initPosition: 初始化所有盒子位置(特效，可用可不用)
   */
  initPosition = () => {
    if (!document.querySelector('.' + this.boxClass) || !document.querySelectorAll('.' + this.cardClass)) return
    let aDiv = document.querySelectorAll('.' + this.cardClass ); // 获取所有盒子
    let windowCW = document.querySelector('.' + this.boxClass).offsetWidth;  //获取窗口视口的宽度
    let l = windowCW / 2 - this.cardWidth / 2; // 盒子从页面中间散开
    for (let i = 0; i < aDiv.length; i++) {
      aDiv[i].style.left = l + "px"; // 初始化盒子left
      aDiv[i].style.top = 100 + "px"; // 初始化盒子top
    }
  }

  /**
   * @resize: 监测浏览器缩放
   */
  resize = () => {
    // 浏览器拖动,重新计算布局
    let btn = true
    window.addEventListener('resize', () => {
      if (!btn) return
      btn = false
      let time = setTimeout(() => {
        this.waterfall()
        btn = true
        clearTimeout(time)
      }, 300)
    }, false);
  }

  /**
   * @waterfall: 瀑布流
   */
  waterfall = () => {
    if (!document.querySelector('.' + this.boxClass) || !document.querySelectorAll('.' + this.cardClass)) return
    // 内容盒子宽度324px ,边距20px
    let cardWidth = this.cardWidth
    let margin = this.margin
    let windowCW = document.querySelector('.' + this.boxClass).offsetWidth;  //获取窗口视口的宽度
    let aDiv = document.querySelectorAll('.' + this.cardClass); // 获取所有盒子
    let n = Math.floor(windowCW / cardWidth); // 一行能容纳多少个div，并向下取整
    if (n <= 0) return
    let arrH = []; //定义一个数组存放div的高度
    for (let i = 0; i < aDiv.length; i++) {
      let j = i % n;
      if (arrH.length === n) { // 一行排满n个，后到下一行
        let min = this.findMin(arrH); //从最“矮”的排起，可以从下图的序号中看得出来，下一行中序号是从矮到高排列的
        aDiv[i].style.left = min * cardWidth + min * margin + "px"; // left
        aDiv[i].style.top = arrH[min] + margin + "px"; // top
        arrH[min] += aDiv[i].offsetHeight + margin;
      } else { // 第一行排n个
        arrH[j] = aDiv[i].offsetHeight; // left
        aDiv[i].style.left = cardWidth * j + j * margin + "px"; // top
        aDiv[i].style.top = 0; // 第一行top 0
      }
    }

    // 由于是绝对定位，父元素没有了高度，底部需要留白，故给父元素设置高度
    let h = Math.max.apply(null, arrH)
    document.querySelector('.' + this.boxClass).style.height = h + 20 + 'px'
  }

  findMin = (arr) => {
    let m = 0;
    for (let i = 0; i < arr.length; i++) {
      m = Math.min(arr[m], arr[i]) == arr[m] ? m : i;
    }
    return m;
  }

}
