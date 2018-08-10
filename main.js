new Vue({
  el: "#app",
  data() {
    return {
      info: null,
      loading: false,
      errored: false,
      busca: "",
      bandaInfo: null,
      details: false,
      list: false,
      locale: null,
      localArtist: null,
      tag: null,
      tagList: false,
      userInfo: null
    };
  },
  methods: {
    setLoading: function() {
      this.loading = true;
      this.errored = false;
    },
    grabSimilar: function(banda) {
      this.loading = true;
      this.tagList = false;
      this.list = false;
      axios
        .get(
          "http://ws.audioscrobbler.com/2.0/?method=artist.getSimilar&artist=" +
            banda +
            "&api_key=API-KEY&format=json"
        )
        .then(response => {
          if (response.data.hasOwnProperty("error")) {
            this.info = null;
          } else {
            this.info = response.data;
          }
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
          this.list = true;
          this.tagList = false;
          var bLazy = new Blazy();
          console.log("Loading done");
        });
    },
    grabBandaInfo: function(banda) {
      this.loading = true;
      this.errored = false;
      axios
        .get(
          "http://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=" +
            banda +
            "&api_key=API-KEY&format=json"
        )
        .then(response => {
          this.bandaInfo = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
          $("#basicExampleModal").modal();
          console.log(this.bandaInfo);
        });
    },
    grabTopArtists: function() {
      this.loading = true;
      this.errored = false;
      axios
        .get(
          "http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=" +
            this.locale +
            "&api_key=API-KEY&format=json"
        )
        .then(response => {
          console.log(response);

          this.localArtist = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    searchTag: function(tag) {
      this.loading = true;
      this.list = false;
      this.errored = false;
      axios
        .get(
          "http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=" +
            tag +
            "&api_key=API-KEY&format=json"
        )
        .then(response => {
          console.log(response);
          this.tag = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.tagList = true;
          var bLazy = new Blazy();
          this.loading = false;
        });
    },
    getUserInfo: function() {
      this.loading = true;
      this.errored = false;
      axios
        .get(
          "http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=Myoue&api_key=API-KEY&format=json"
        )
        .then(response => {
          console.log(response);
          this.userInfo = response.data;
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          $(".owl-carousel").owlCarousel({
            items: 4,
            rows: 2,
            lazyLoad: true,
            loop: true,
            nav: false,
            dots: true,
            margin: 10,
            responsive: {
              0: {
                items: 1,
                nav: true,
                dots: false
              },
              600: {
                items: 3
              },
              1000: {
                items: 5
              }
            }
          });
          this.loading = false;
        });
    }
    // http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=disco&api_key=YOUR_API_KEY&format=json
  },
  mounted() {
    this.loading = true;
    axios
      .get("https://ipapi.co/json/")
      .then(response => {
        console.log(response.data);
        this.locale = response.data.country_name;
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => {
        this.loading = false;
        axios
          .get(
            "http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=" +
              this.locale +
              "&api_key=API-KEY&format=json"
          )
          .then(response => {
            console.log(response);
            this.localArtist = response.data;
          })
          .catch(error => {
            console.log(error);
            this.errored = true;
          })
          .finally(() => {
            $(".owl-carousel").owlCarousel({
              items: 4,
              lazyLoad: true,
              loop: true,
              nav: false,
              dots: true,
              margin: 10,
              responsive: {
                0: {
                  items: 1,
                  nav: true,
                  dots: false
                },
                600: {
                  items: 3
                },
                1000: {
                  items: 5
                }
              }
            });
            this.loading = false;
          });
      });
  }
});
