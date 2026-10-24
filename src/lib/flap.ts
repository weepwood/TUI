import { CHARSET } from './data'

/* 翻牌引擎：上半页落下 / 下半页合上的机械翻转，纯 DOM 操作，与框架解耦 */

const N_COLS = 13
const STAGGER = 62
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export class FlapCell {
  private topG: HTMLElement
  private botG: HTMLElement
  private fallG: HTMLElement
  private landG: HTMLElement
  private fallE: HTMLElement
  private landE: HTMLElement
  private cur = 0
  private target = 0
  private busy = false
  private reduced: boolean

  constructor(root: HTMLElement, reduced: boolean) {
    this.reduced = reduced
    this.topG = root.querySelector('.sf-top span')!
    this.botG = root.querySelector('.sf-bottom span')!
    this.fallG = root.querySelector('.sf-fall span')!
    this.landG = root.querySelector('.sf-land span')!
    this.fallE = root.querySelector('.sf-fall')!
    this.landE = root.querySelector('.sf-land')!
    this.paint(0)
  }

  private paint(i: number) {
    this.topG.textContent = CHARSET[i]
    this.botG.textContent = CHARSET[i]
  }

  /** 单次翻动：旧字符上半页落下（渐暗），新字符下半页合上（渐亮） */
  private flipOnce(next: number, dur: number): Promise<void> {
    const oldCh = CHARSET[this.cur]
    const newCh = CHARSET[next]
    this.topG.textContent = newCh
    this.fallG.textContent = oldCh
    this.landG.textContent = newCh
    this.fallE.style.display = 'block'
    if (this.reduced) {
      this.fallE.style.display = 'none'
      this.botG.textContent = newCh
      return Promise.resolve()
    }
    return new Promise(res => {
      const a = this.fallE.animate(
        [
          { transform: 'rotateX(0deg)', opacity: 1 },
          { transform: 'rotateX(-90deg)', opacity: 0.55 },
        ],
        { duration: dur, easing: 'cubic-bezier(.55,0,.9,.6)' },
      )
      a.onfinish = () => {
        this.fallE.style.display = 'none'
        this.landE.style.display = 'block'
        const b = this.landE.animate(
          [
            { transform: 'rotateX(90deg)', opacity: 0.55 },
            { transform: 'rotateX(0deg)', opacity: 1 },
          ],
          { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)' },
        )
        b.onfinish = () => {
          this.landE.style.display = 'none'
          this.botG.textContent = newCh
          res()
        }
      }
    })
  }

  /** 沿字轮正向翻到目标；目标可在行进中随时更新 */
  async walkTo(target: number): Promise<void> {
    this.target = target
    if (this.busy) return
    this.busy = true
    while (this.cur !== this.target) {
      const next = (this.cur + 1) % CHARSET.length
      const dist = (this.target - this.cur + CHARSET.length) % CHARSET.length
      const dur = dist > 6 ? 42 : 88
      await this.flipOnce(next, dur)
      this.cur = next
      await sleep(6)
    }
    this.busy = false
  }

  /** 当前显示的字符 */
  get char(): string {
    return CHARSET[this.cur]
  }
}

export class FlapBoardEngine {
  private cells: FlapCell[] = []
  private timer = 0
  private pi = 0
  private phrases: string[] = []
  private interval = 4200
  /** 由外部 IO 维护：滚出视口时停翻，省帧 */
  visible = true

  constructor(row: HTMLElement, reduced: boolean) {
    for (let i = 0; i < N_COLS; i++) {
      const c = document.createElement('div')
      c.className = 'sf-cell'
      c.innerHTML =
        '<div class="sf-half sf-top"><span></span></div>' +
        '<div class="sf-half sf-bottom"><span></span></div>' +
        '<div class="sf-seam"></div>' +
        '<div class="sf-flap sf-fall"><span></span></div>' +
        '<div class="sf-flap sf-land"><span></span></div>'
      row.appendChild(c)
      this.cells.push(new FlapCell(c, reduced))
    }
  }

  setPhrase(str: string): void {
    const s = str.toUpperCase().slice(0, N_COLS).padEnd(N_COLS, ' ')
    this.cells.forEach((c, i) => {
      const idx = CHARSET.indexOf(s[i])
      setTimeout(() => c.walkTo(idx < 0 ? 0 : idx), i * STAGGER)
    })
  }

  startRotation(phrases: string[], interval: number): void {
    this.phrases = phrases
    this.pi = 0
    this.setInterval(interval)
    this.setPhrase(phrases[0])
  }

  setInterval(ms: number): void {
    this.interval = ms
    clearTimeout(this.timer)
    const loop = () => {
      this.timer = setTimeout(() => {
        if (!document.hidden && this.visible) {
          this.pi = (this.pi + 1) % this.phrases.length
          this.setPhrase(this.phrases[this.pi])
        }
        loop()
      }, this.interval)
    }
    loop()
  }

  /** 用户手动翻牌后，从这句继续轮播 */
  poke(phrase: string): void {
    this.setPhrase(phrase)
    const i = this.phrases.indexOf(phrase)
    this.pi = i < 0 ? 0 : i
  }

  randomFlip(): void {
    const cur = this.current().trim()
    const pool = this.phrases.filter(p => p !== cur)
    this.poke(pool[Math.floor(Math.random() * pool.length)] ?? this.phrases[0])
  }

  current(): string {
    return this.cells.map(c => c.char).join('')
  }

  destroy(): void {
    clearTimeout(this.timer)
  }
}
