// var canvas = document.getElementById("canvas");
// var ctx = canvas.getContext("2d");
// var width = canvas.width;
// var height = canvas.height;
var circles = [];
var xp = 0;
var yp = 0;

$(window).scroll(function(){
    $('.prompt').css('opacity', 1 - $(window).scrollTop() / 250);

    if ($(window).scrollTop() < 25 && $('.nav-wrapper').hasClass('nav-dark')) {
        $('.nav-wrapper').removeClass('nav-dark');
        $('.nav-wrapper').addClass('nav-dark-clear');
        $('nav').addClass('nav-no-shadow');
    }
    if ($(window).scrollTop() >= 25 && $('.nav-wrapper').hasClass('nav-dark-clear')) {
        $('.nav-wrapper').removeClass('nav-dark-clear');
        $('nav').removeClass('nav-no-shadow');
        $('.nav-wrapper').addClass('nav-dark');
    }
});

window.sr = ScrollReveal({ reset: false });

$(document).ready(function(){
    $('.tooltipped').tooltip();

    $("a.scroll-link").click(function (event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - window.innerHeight / 6 }, 650);
    });
});

sr.reveal('.reveal-fast', { duration: 1200 });
sr.reveal('.reveal-slow', { duration: 1700 });
sr.reveal('.reveal-slower', { duration: 2200 });

new TypeIt('#buzzwords', {
  strings: ["happy.", "relaxed.", "excited.", "hopeful.", "joyful."],
  startDelay: 1000,
  speed: 80,
  deleteSpeed: 40,
  nextStringDelay: 2500,
  breakLines: false,
  waitUntilVisible: true,
  loop: true,
  lifeLike: true
}).go();

var doughnutChart = null;

function uploadFile(event) {
    event.preventDefault();
    var data = new FormData($('form').get(0));

    var toast = M.toast({html: 'Loading &nbsp;&nbsp;&nbsp; <div class="preloader-wrapper small active"><div class="spinner-layer spinner-red-only" style="border-color: #C96363;"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>', classes: 'rounded', displayLength: 1000000});

    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: data,
        cache: false,
        processData: false,
        contentType: false,
        success: function(data) {
            // console.log("Received: " + data);
            displayData(data);
            toast.dismiss();
        },
        error: function(jqXHR, exception) {
            if (jqXHR.status == 413) {
                displayData('###FILE_TOO_LARGE###');
                toast.dismiss();
            }
        }
    });
    return false;
}

$(function() {
    $('form').submit(uploadFile);
});

var colorHappy = '#B0FF4B';
var colorAngry = '#FF4B4B';
var colorSad = '#95B2FF';
var colorRelaxed = '#E095FF';


function displayData(_data) {
    if (_data == '###FILE_NOT_RECIEVED###') {
        M.toast({html: 'File not recieved', classes: 'rounded'});
        return;
    }

    if (_data == '###FILE_NOT_VALID###') {
        M.toast({html: 'Invalid file type', classes: 'rounded'});
        return;   
    }

    if (_data == '###ERROR_OCCURRED###') {
        M.toast({html: 'An error occurred please try again', classes: 'rounded'});
        return;
    }

    if (_data == '###FILE_TOO_LARGE###') {
        M.toast({html: 'File size must not exceed 25MB', classes: 'rounded'})
        return;
    }

    var data = { labels: [], datasets: [{ backgroundColor: [], data: [] }] };

    var items = _data.split(",");

    var dataSplit = [];

    for (var i = 0; i < items.length; i++) {
        dataSplit.push(items[i].split("|"));
    }

    // console.log(dataSplit);

    for (var i = 0; i < dataSplit.length; i++) {
        data['labels'].push(dataSplit[i][0]);
        data['datasets'][0]['data'].push(dataSplit[i][1]);
        data['datasets'][0]['backgroundColor'].push(dataSplit[i][2]);
    }

    if (doughnutChart != null) {
        doughnutChart.data = data;
        doughnutChart.update();
        return;
    }

    var graph = document.getElementById("graph");
    var ctxg = graph.getContext("2d");

    ctxg.clearRect(0, 0, graph.width, graph.height);

    graph.height = getGraphHeight();

    doughnutChart = new Chart(ctxg, {
        type: 'doughnut',
        data: data,
        options: {
            legend: {
                labels: {
                    fontColor: '#F5F5F5'
                }
            }
        }
    });
}

var graphgenrebar = document.getElementById("graphgenrebar");
var ctxgraphgenrebar = graphgenrebar.getContext("2d");

ctxgraphgenrebar.clearRect(0, 0, graphgenrebar.width, graphgenrebar.height);

graphgenrebar.height = getGraphHeight();

var graphgenrebarchart = new Chart(ctxgraphgenrebar, {
    type: 'bar',
    data: {
    labels: ['Rock', 'Jazz', '80s', 'Soul', 'Indie', 'Country', 'Classic Rock', 'Christmas'],
    datasets: [{ 
        data: [34,29,30,81,12,33,56,62],
        label: "Happy",
        backgroundColor: colorHappy,
        fill: true
      }, {
      data: [47,5,18,23,28,15,24,0],
        label: "Angry",
        backgroundColor: colorAngry,
        fill: true
      }, {
      data: [35,14,8,9,27,22,19,1],
        label: "Sad",
        backgroundColor: colorSad,
        fill: true
      }, {
      data: [25,34,10,36,18,42,35,52],
        label: "Relaxed",
        backgroundColor: colorRelaxed,
        fill: true
      }
    ]
    },
    options: {
        title: {
            display: true,
            fontColor: '#F5F5F5',
            text: 'Emotion Proportions Per Genre'
        },
        scales: {
            xAxes: [{ 
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
                stacked: true
            }],
            yAxes: [{
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
                stacked: true
            }],
        },
        legend: {
            labels: {
                fontColor: '#F5F5F5'
            }
        },
    }
});


var graphemotionline = document.getElementById("graphemotionline");
var ctxgraphemotionline = graphemotionline.getContext("2d");

ctxgraphemotionline.clearRect(0, 0, graphemotionline.width, graphemotionline.height);

graphemotionline.height = getGraphHeight();

var graphemotionlinechart = new Chart(ctxgraphemotionline, {
    type: 'line',
    data: {
    labels: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019],
    datasets: [{ 
        data: [0.206106870229008,0.29951690821256,0.232876712328767,0.428571428571429,0.645161290322581,0.444444444444444,0.142857142857143,0.375,0.625,0.888888888888889,0.666666666666667,0.5
],
        label: "Happy",
        borderColor: colorHappy,
        fill: false
      }, {
      data: [0.381679389312977,0.27536231884058,0.246575342465753,0.178571428571429,0.064516129032258,0.185185185185185,0.428571428571429,0.375,0.125,0,0.111111111111111,0.5],
        label: "Angry",
        borderColor: colorAngry,
        fill: false
      }, {
      data: [0.206106870229008,0.222222222222222,0.273972602739726,0.285714285714286,0.096774193548387,0.185185185185185,0.142857142857143,0.125,0.125,0,0,0],
        label: "Sad",
        borderColor: colorSad,
        fill: false
      }, {
      data: [0.206106870229008,0.202898550724638,0.246575342465753,0.107142857142857,0.193548387096774,0.185185185185185,0.285714285714286,0.125,0.125,0.111111111111111,0.222222222222222,0],
        label: "Relaxed",
        borderColor: colorRelaxed,
        fill: false
      }
    ]
    },
    options: {
        title: {
            display: true,
            fontColor: '#F5F5F5',
            text: 'Emotion Over Time'
        },
        scales: {
            xAxes: [{ 
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
            }],
            yAxes: [{
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
            }],
        },
        legend: {
            labels: {
                fontColor: '#F5F5F5'
            }
        },
    }
});

var graphemotionbar = document.getElementById("graphemotionbar");
var ctxgraphemotionbar = graphemotionbar.getContext("2d");

ctxgraphemotionbar.clearRect(0, 0, graphemotionbar.width, graphemotionbar.height);

graphemotionbar.height = getGraphHeight();

var graphemotionbarchart = new Chart(ctxgraphemotionbar, {
    type: 'bar',
    data: {
    labels: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019],
    datasets: [{ 
        data: [0.206106870229008,0.29951690821256,0.232876712328767,0.428571428571429,0.645161290322581,0.444444444444444,0.142857142857143,0.375,0.625,0.888888888888889,0.666666666666667,0.5
],
        label: "Happy",
        backgroundColor: colorHappy,
        fill: true
      }, {
      data: [0.381679389312977,0.27536231884058,0.246575342465753,0.178571428571429,0.064516129032258,0.185185185185185,0.428571428571429,0.375,0.125,0,0.111111111111111,0.5],
        label: "Angry",
        backgroundColor: colorAngry,
        fill: true
      }, {
      data: [0.206106870229008,0.222222222222222,0.273972602739726,0.285714285714286,0.096774193548387,0.185185185185185,0.142857142857143,0.125,0.125,0,0,0],
        label: "Sad",
        backgroundColor: colorSad,
        fill: true
      }, {
      data: [0.206106870229008,0.202898550724638,0.246575342465753,0.107142857142857,0.193548387096774,0.185185185185185,0.285714285714286,0.125,0.125,0.111111111111111,0.222222222222222,0],
        label: "Relaxed",
        backgroundColor: colorRelaxed,
        fill: true
      }
    ]
    },
    options: {
        title: {
            display: true,
            fontColor: '#F5F5F5',
            text: 'Emotion Over Time'
        },
        scales: {
            xAxes: [{ 
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
                stacked: true
            }],
            yAxes: [{
                gridLines: {
                    display: true,
                    color: '#858585',
                },
                ticks: {
                  fontColor: "#CCC", // this here
                },
                stacked: true
            }],
        },
        legend: {
            labels: {
                fontColor: '#F5F5F5'
            }
        },
    }
});

anime({
    targets: '.wobble0',
    translateX: 100,
    easing: 'linear',
    duration: 12000,
    loop: true
});

var outlineColor = 'rgba(90,84,84,1)';

function randval1() {
anime({
    targets: '.wobble1',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(33,33,33,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(550, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval1
});
}

randval1();

function randval2() {
anime({
    targets: '.wobble2',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(55,55,55,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(625, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval2
});
}

randval2();


function randval3() {
anime({
    targets: '.wobble3',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(52,52,52,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(700, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval3
});
}

randval3();

function randval4() {
anime({
    targets: '.wobble4',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(49,49,49,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(751, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval4
});
}

randval4();

function randval5() {
anime({
    targets: '.wobble5',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(45,45,45,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(850, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval5
});
}

randval5();

function randval6() {
anime({
    targets: '.wobble6',
    translateX: function() {
      return anime.random(-30, 30);
    },
    stroke: {value: [outlineColor, 'rgba(42,42,42,1)'], duration: 4000},
    strokeDashoffset: {
      value: [anime.setDashoffset, 0],
      duration: 4000,
      easing: 'easeInOutSine',
      delay: anime.stagger(915, {direction: 'reverse'}),
    },
    easing: 'easeInOutSine',
    duration: 4000,
    complete: randval6
});
}

randval6();

function getOpacityOverlay() {
    if (window.pageYOffset < window.innerHeight) {
        return 3 * Math.pow(window.pageYOffset / window.innerHeight, 3);
    }
    return 1;
}

function getGraphHeight() {
    if (window.innerHeight / window.innerWidth > 1.42) {
        return window.innerHeight * .4;
    }
    return window.innerHeight * .15;
}

var height = window.innerHeight;
var width = window.innerWidth;

function resize() {
    height = window.innerHeight;
    width = window.innerWidth;

    var visibleHeight = (height * 1000 / width);

    for (var i = 1; i < 7; i++) {
        path = String($('.wobble' + i).attr('d')).split(' ');
        path[3] = String((7 - i) * visibleHeight / 7);
        path[path.length - 2] = String((7 - i) * visibleHeight / 7 * -1);
        $('.wobble' + i).attr('d', path.join(' '));
    }
}

resize();

function checkResize() {
    if (height != window.innerHeight || width != window.innerWidth) {
        resize();
    }
}

setInterval(checkResize, 20);
