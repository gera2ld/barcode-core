const UNIT_WIDTH = 3;
const PADDING = 8;
const CONTENT_WIDTH = 95 * UNIT_WIDTH;
const CONTENT_HEIGHT = 160;
const CANVAS_WIDTH = CONTENT_WIDTH + 2 * PADDING;
const CANVAS_HEIGHT = CONTENT_HEIGHT + 2 * PADDING;

new Vue({
  data: {
    input: '',
    error: null,
  },
  watch: {
    input: 'update',
  },
  methods: {
    update() {
      try {
        const data = this.input && barcode.ean13.encode(this.input);
        this.error = null;
        if (data) this.draw(data);
      } catch (e) {
        this.error = `${e}`;
        console.error(e);
      }
    },
    draw(data) {
      const { canvas } = this.$refs;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.style = 'black';
      const drawUnit = (x, h = CONTENT_HEIGHT) => {
        ctx.fillRect(PADDING + x * UNIT_WIDTH, PADDING, UNIT_WIDTH, h);
      };
      const drawNumber = (num, offset) => {
        for (let i = 0; i < 7; i += 1) {
          if (num & (1 << (6 - i))) drawUnit(offset + i, CONTENT_HEIGHT * 0.8);
        }
      };
      drawUnit(0);
      drawUnit(2);
      drawUnit(46);
      drawUnit(48);
      drawUnit(92);
      drawUnit(94);
      for (let i = 0; i < 6; i += 1) {
        drawNumber(data[i], 3 + 7 * i);
        drawNumber(data[6 + i], 50 + 7 * i);
      }
    },
  },
  mounted() {
    const { canvas } = this.$refs;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    this.update();
  },
}).$mount('#app');
