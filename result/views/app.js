const socket = io.connect({transports:['polling']});

new Vue({
  el: "#app",

  data: {
    aCategory: "50%",
    bCategory: "50%",
    total: 0,
  },

  methods: {
    getPercentages: function (a, b) {
      let result = {};
    
      if (a + b > 0) {
        result.a = Math.round(a / (a + b) * 100);
        result.b = 100 - result.a;
      } else {
        result.a = result.b = 50;
      }
    
      return result;
    },

    updateScores: function() {
      const that = this;
      socket.on('scores', function (json) {
        data = JSON.parse(json);
        const a = parseInt(data.a || 0);
        const b = parseInt(data.b || 0);
  
        const percentages = that.getPercentages(a, b);
  
        that.aCategory = percentages.a + "%";
        that.bCategory = percentages.b + "%";
        that.total = a + b;
     });
    },

    init: function() {
      document.body.style.opacity = 1;
      this.updateScores();
    },
  },

  created: function () {
    const that = this;
    socket.on('message',function(data){
      that.init();
    });
  }
});