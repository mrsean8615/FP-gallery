var jsonData = "js/data.json";


function httpRequest() {
    var xhttp = new XMLHttpRequest();

    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("Browser Outdated");
        return false;
    }
    return xhttp;
}

function loadMore() {

};

$(document).ready(function() {
    var x = 0;
    $('#load-more').on('click', function() {
        x += 10;
        getGallery(x, 'append');
    });
});

function getGallery(x, type) {
    var response = '';
    $(document).ready(function() {
        $.getJSON('js/data.json', function(data) {
            $.each(data, function(key, value) {
                var y = 0;
                $.each(value, function(index, stuff) {
                    if (value[x + y].title != "last") {
                        if (index + x < 10 + x) {
                            response += '<div class="gallery-item">';
                            response += '<img loading="lazy" alt="gallery image ' + x + y + '" class="gimg lazy" onclick="details(this)" src="' + value[x + y].imgSrc + '">';
                            response += '<div class="over">' + value[x + y].title + '</div>';
                            response += '</div>';
                            y += 1;
                        }
                    } else {
                        $('#load-more').css('display', 'none');
                    }
                });
            });
            if (type === 'html') {
                $('#gallery').html(response);
            } else {
                $('#gallery').append(response);
            }

            $(document).ready(function() {
                $(".gallery-item").mouseover(function() {
                    $(this).addClass('active');
                });
                $(".gallery-item").mouseout(function() {
                    $(this).removeClass('active');

                });
            });
        });
    });


}

function getFavorites() {
    var response = '';
    $(document).ready(function() {
        $.getJSON('js/data.json', function(data) {
            $.each(data, function(key, value) {
                $.each(value, function(index, stuff) {
                    if (stuff.favorite == true) {
                        response += '<div class="gallery-item">';
                        response += '<img loading="lazy" class="gimg lazy" alt="favorite images" onclick="details(this)" src="' + stuff.imgSrc + '">';
                        response += '<div class="over">' + stuff.title + '</div>';
                        response += '</div>';
                    }

                });
            });
            $('.favorites').html(response);
            $('.favorites').shuffleChildren();

            $(document).ready(function() {
                $(".gallery-item").mouseover(function() {
                    $(this).addClass('active');
                });
                $(".gallery-item").mouseout(function() {
                    $(this).removeClass('active');

                });
            });
        });
    });


}

function search() {
    var input = document.getElementById('search').value.toLowerCase();
    xhttp = httpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            var response = "";
            var jsonObj = JSON.parse(xhttp.responseText);
            for (x = 0; x < jsonObj.gallery.length; x++) {
                var lowercaseTitle = jsonObj.gallery[x].title.toLowerCase();
                // var lowercaseCollection = jsonObj.gallery[x].collection.toLowerCase();

                if (lowercaseTitle.indexOf(input) > -1 &&
                    // lowercaseCollection.indexOf(input) > -1 
                    input != '') {
                    response += '<div class="gallery-item">';
                    response += '<img loading="lazy" class="gimg lazy" onclick="details(this)" src="' + jsonObj.gallery[x].imgSrc + '">';
                    response += '<div class="over">' + jsonObj.gallery[x].title + '</div>';
                    response += '</div>';
                }

            }
            $('#gallery').html(response);
            $(document).ready(function() {
                $(".gallery-item").mouseover(function() {
                    $(this).addClass('active');
                });
                $(".gallery-item").mouseout(function() {
                    $(this).removeClass('active');

                });
            });
        }

    }

    xhttp.open("GET", jsonData, true);
    xhttp.send();
}

function getCollection(element) {
    var e = element.value.toLowerCase();
    console.log(e);
    xhttp = httpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            var response = "";
            var jsonObj = JSON.parse(xhttp.responseText);
            for (x = 0; x < jsonObj.gallery.length; x++) {
                if (e == jsonObj.gallery[x].collection) {
                    response += '<div class="gallery-item">';
                    response += '<img loading="lazy" class="gimg lazy" alt="collection images" onclick="details(this)" src="' + jsonObj.gallery[x].imgSrc + '">';
                    response += '<div class="over">' + jsonObj.gallery[x].title + '</div>';
                    response += '</div>';
                }

            }
            $('.collect').html(response);
            $(document).ready(function() {
                $(".gallery-item").mouseover(function() {
                    $(this).addClass('active');
                });
                $(".gallery-item").mouseout(function() {
                    $(this).removeClass('active');

                });
            });
        }

    }

    xhttp.open("GET", jsonData, true);
    xhttp.send();
}



function details(element) {
    var e = $(element).clone();
    $(e).removeAttr('onclick');
    $('.expand').append(e);
    $('.expand').css("display", "block");


}

function destroy() {
    $('.expand').css("display", "none");
    $('.expand img').remove();

}



$.fn.shuffleChildren = function() {
    $.each(this.get(), function(index, el) {
        var $el = $(el);
        var $find = $el.children();

        $find.sort(function() {
            return 0.5 - Math.random();
        });

        $el.empty();
        $find.appendTo($el);
    });
};

document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages = document.querySelectorAll("img.lazy");
    var lazyloadThrottleTimeout;

    function lazyload() {
        if (lazyloadThrottleTimeout) {
            clearTimeout(lazyloadThrottleTimeout);
        }

        lazyloadThrottleTimeout = setTimeout(function() {
            var scrollTop = window.pageYOffset;
            lazyloadImages.forEach(function(img) {
                if (img.offsetTop < (window.innerHeight + scrollTop)) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                }
            });
            if (lazyloadImages.length == 0) {
                document.removeEventListener("scroll", lazyload);
                window.removeEventListener("resize", lazyload);
                window.removeEventListener("orientationChange", lazyload);
            }
        }, 20);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
});